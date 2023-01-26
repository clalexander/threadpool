import { DynamoDB } from 'aws-sdk';
import { JsonValue } from 'type-fest';
import { convertDateStrings, safeStringify } from 'utils';
import { aws } from './aws';

const BATCH_GET_MAX_KEYS_LENGTH = 100;

export interface QuerySpec {
  index?: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, string>;
  expressionAttributeNames?: Record<string, string>;
  getItemAfterQuery?: boolean;
}

export type AttributeValue<T> = JsonValue | ((item: T) => JsonValue);
export type AdditionalAttributes<T> = Record<string, AttributeValue<T>>;

export interface DynamoDBDataProviderOptions<T> {
  querySpecs?: QuerySpec[];
  convertDateStrings?: boolean; // defaults to true
  additionalAttributes?: AdditionalAttributes<T>;
}

export class DynamoDBDataProvider<
  T = any,
  KeyOptions extends Record<string, any> = Record<string, any>,
  QueryOptions extends Record<string, any> = Record<string, any>,
> {
  private readonly db = aws().dynamoDB();

  constructor(
    public readonly tableName: string,
    private readonly options?: DynamoDBDataProviderOptions<T>,
  ) {}

  protected get querySpecs() { return this.options?.querySpecs || []; }

  protected get convertDateStrings() { return this.options?.convertDateStrings !== false; }

  protected get additionalAttributes() { return this.options?.additionalAttributes || {}; }

  protected marshallData(data: Record<string, any>[]): DynamoDB.AttributeMap[];
  protected marshallData(data: Record<string, any>): DynamoDB.AttributeMap;
  protected marshallData(
    data: Record<string, any> | Record<string, any>[],
  ): DynamoDB.AttributeMap | DynamoDB.AttributeMap[] {
    const jsonData = JSON.parse(safeStringify(data)) as Record<string, any> | Record<string, any>[];
    if (Array.isArray(jsonData)) {
      return jsonData.map((record) => DynamoDB.Converter.marshall(record));
    }
    return DynamoDB.Converter.marshall(jsonData);
  }

  protected unmarshallData(data: DynamoDB.AttributeMap[]): Record<string, any>[];
  protected unmarshallData(data: DynamoDB.AttributeMap): Record<string, any>;
  protected unmarshallData(
    data: DynamoDB.AttributeMap | DynamoDB.AttributeMap[],
  ): Record<string, any> | Record<string, any>[] {
    let result: Record<string, any> | Record<string, any>[];
    if (Array.isArray(data)) {
      result = data.map((record) => DynamoDB.Converter.unmarshall(record));
    } else {
      result = DynamoDB.Converter.unmarshall(data);
    }
    if (this.convertDateStrings) {
      convertDateStrings(result);
    }
    return result;
  }

  public async getItem(options: KeyOptions): Promise<T | null> {
    const key = this.marshallData(options);
    const params = {
      Key: key,
      TableName: this.tableName,
    };
    const request = this.db.getItem(params);
    const result = await request.promise();
    const marshalledItem = result.Item;
    if (!marshalledItem) {
      return null;
    }
    const item = this.unmarshallData(marshalledItem);
    const additionalAttributeKeys = Object.keys(this.additionalAttributes);
    const filteredItem = Object.keys(item)
      .filter((k) => !additionalAttributeKeys.includes(k))
      .reduce((acc, k) => ({ ...acc, [k]: item[k] }), {});
    return filteredItem as T;
  }

  public async getItems(options: KeyOptions[]): Promise<T[]> {
    const keys = this.marshallData(options);
    const items: T[] = [];
    do {
      const batchKeys = keys.splice(0, BATCH_GET_MAX_KEYS_LENGTH);
      const params = {
        RequestItems: {
          Items: {
            Keys: batchKeys,
            TableName: this.tableName,
          },
        },
      };
      const request = this.db.batchGetItem(params);
      // eslint-disable-next-line no-await-in-loop
      const result = await request.promise();
      const { Responses, UnprocessedKeys } = result;
      const marshalledItems = Responses?.Items;
      if (!marshalledItems) {
        break;
      }
      const batchItems = this.unmarshallData(marshalledItems) as T[];
      items.push(...batchItems);
      if (UnprocessedKeys) {
        const unprocessed = Object.values(UnprocessedKeys)
          .map((value) => value.Keys)
          .reduce((acc, ks) => [...acc, ...ks], []);
        keys.unshift(...unprocessed);
      }
    } while (keys.length > 0);
    const additionalAttributeKeys = Object.keys(this.additionalAttributes);
    const filteredItems = items.map((item: any) => Object.keys(item)
      .filter((k) => !additionalAttributeKeys.includes(k))
      .reduce((acc, k) => ({ ...acc, [k]: item[k] }), {}));
    return filteredItems as T[];
  }

  protected getComputedAttributeValue(item: T, attributeValue: AttributeValue<T>): JsonValue {
    if (typeof attributeValue === 'function') {
      return attributeValue(item);
    }
    return attributeValue;
  }

  protected getAdditionalAttributes(item: T): Record<string, JsonValue> {
    return Object.entries(this.additionalAttributes)
      .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: this.getComputedAttributeValue(item, value),
      }), {});
  }

  public async putItem(item: T): Promise<void> {
    const augmentedItem = {
      ...item,
      ...this.getAdditionalAttributes(item),
    };
    const marshalledItem = this.marshallData(augmentedItem);
    const params = {
      Item: marshalledItem,
      TableName: this.tableName,
    };
    const request = this.db.putItem(params);
    await request.promise();
  }

  public async deleteItem(options: KeyOptions): Promise<void> {
    const key = this.marshallData(options);
    const params = {
      Key: key,
      TableName: this.tableName,
    };
    const request = this.db.deleteItem(params);
    await request.promise();
  }

  public async queryItem(options: QueryOptions): Promise<T | null> {
    const items = await this.queryItems(options);
    return items[0] || null;
  }

  public async queryItems(options: QueryOptions): Promise<T[]> {
    const keys = Object.keys(options);
    const spec = this.querySpecs.find((qs) => Object.values(qs.expressionAttributeValues)
      .every((key) => keys.includes(key)));
    if (!spec) {
      throw new Error('Invalid query options, no spec defined for options');
    }
    const marshalledAttributes = this.marshallData(options);
    const expressionAttributeValues = Object.entries(spec.expressionAttributeValues)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: marshalledAttributes[value] }), {});
    const baseParams = {
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: spec.expressionAttributeNames,
      KeyConditionExpression: spec.keyConditionExpression,
      IndexName: spec.index,
      TableName: this.tableName,
    };
    let lastEvaluatedKey: DynamoDB.Key | undefined;
    const items = [];
    do {
      const params = {
        ...baseParams,
      };
      if (lastEvaluatedKey) {
        Object.assign(params, { LastEvaluatedKey: lastEvaluatedKey });
      }
      const request = this.db.query(params);
      // eslint-disable-next-line no-await-in-loop
      const result = await request.promise();
      const { Items, LastEvaluatedKey } = result;
      if (!Items) {
        break;
      }
      const batchItems = this.unmarshallData(Items);
      items.push(...batchItems);
      lastEvaluatedKey = LastEvaluatedKey;
    } while (lastEvaluatedKey);
    if (spec.getItemAfterQuery) {
      return this.getItems(items as KeyOptions[]);
    }
    return items as T[];
  }
}

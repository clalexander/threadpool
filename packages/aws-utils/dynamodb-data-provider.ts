import { DynamoDB } from 'aws-sdk';
import { convertDateStrings, safeStringify } from 'utils';
import { aws } from './aws';

export interface QuerySpec {
  index?: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, string>;
  getItemAfterQuery?: boolean;
}

export interface DynamoDBDataProviderOptions {
  querySpecs?: QuerySpec[];
  convertDateStrings?: boolean; // defaults to true
}

export class DynamoDBDataProvider<
  T = any,
  KeyOptions extends Record<string, any> = Record<string, any>,
  QueryOptions extends Record<string, any> = Record<string, any>,
> {
  private readonly db = aws().dynamoDB();

  constructor(
    public readonly tableName: string,
    private readonly options?: DynamoDBDataProviderOptions,
  ) {}

  protected get querySpecs() { return this.options?.querySpecs || []; }

  protected get convertDateStrings() { return this.options?.convertDateStrings !== false; }

  protected encodeItem(item: T): any {
    return JSON.parse(safeStringify(item));
  }

  protected decodeItem(item: any): T | null {
    if (this.convertDateStrings) {
      convertDateStrings(item);
    }
    return item;
  }

  public async getItem(options: KeyOptions): Promise<T | null> {
    const key = DynamoDB.Converter.marshall(options);
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
    const item = DynamoDB.Converter.unmarshall(marshalledItem);
    return this.decodeItem(item);
  }

  public async putItem(item: T): Promise<void> {
    const encodedItem = this.encodeItem(item);
    const marshalledItem = DynamoDB.Converter.marshall(encodedItem);
    const params = {
      Item: marshalledItem,
      TableName: this.tableName,
    };
    const request = this.db.putItem(params);
    await request.promise();
  }

  public async deleteItem(options: KeyOptions): Promise<void> {
    const key = DynamoDB.Converter.marshall(options);
    const params = {
      Key: key,
      TableName: this.tableName,
    };
    const request = this.db.deleteItem(params);
    await request.promise();
  }

  public async queryItem(options: QueryOptions): Promise<T | null> {
    const keys = Object.keys(options);
    const spec = this.querySpecs.find((qs) => Object.keys(qs.expressionAttributeValues)
      .every((key) => keys.includes(key)));
    if (!spec) {
      return null;
    }
    const marshalledAttributes = DynamoDB.Converter.marshall(options);
    const expressionAttributeValues = Object.entries(spec.expressionAttributeValues)
      .reduce((acc, [key, value]) => ({ ...acc, [value]: marshalledAttributes[key] }), {});
    const params = {
      ExpressionAttributeValues: expressionAttributeValues,
      KeyConditionExpression: spec.keyConditionExpression,
      IndexName: spec.index,
      TableName: this.tableName,
    };
    const request = this.db.query(params);
    const result = await request.promise();
    const marshalledItem = result.Items?.[0];
    if (!marshalledItem) {
      return null;
    }
    const item = DynamoDB.Converter.unmarshall(marshalledItem);
    if (spec.getItemAfterQuery) {
      return this.getItem(item as KeyOptions);
    }
    return item as T;
  }
}

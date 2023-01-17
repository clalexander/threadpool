import { DynamoDB } from 'aws-sdk';
import { aws } from './aws';

export type ItemAttributeType = 'S' | 'N' | 'B';

export interface ItemAttribute {
  name: string;
  type: ItemAttributeType;
}

export interface QuerySpec {
  index?: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, string>;
}

type MarshalledAttribute = {
  [Key in ItemAttributeType]?: string;
};

type MarshalledAttributes = Record<string, MarshalledAttribute>;

export class DynamoDBDataProvider<
  T = any,
  KeyOptions extends Record<string, any> = Record<string, any>,
  QueryOptions extends Record<string, any> = Record<string, any>,
> {
  private readonly db = aws().dynamoDB();

  constructor(
    public readonly tableName: string,
    private readonly attributes: ItemAttribute[],
    private readonly querySpecs: QuerySpec[] = [],
  ) {}

  protected marshallAttributes(value: any): MarshalledAttributes {
    return this.attributes
      .filter((att) => value[att.name] !== undefined)
      .reduce((acc, att) => ({
        ...acc,
        [att.name]: { [att.type]: value[att.name].toString() },
      }), {});
  }

  protected parseObject(data: string): any {
    return JSON.parse(data);
  }

  public async getItem(options: KeyOptions): Promise<T | null> {
    const key = this.marshallAttributes(options);
    const params = {
      Key: key,
      TableName: this.tableName,
    };
    const request = this.db.getItem(params);
    const result = await request.promise();
    const item = result.Item;
    if (!item) {
      return null;
    }
    const { object } = item;
    if (!object) {
      return null;
    }
    const objectJson = object.S;
    if (!objectJson) {
      return null;
    }
    return this.parseObject(objectJson);
  }

  public async putItem(data: T): Promise<void> {
    const item = this.marshallAttributes(data);
    item.object = {
      S: JSON.stringify(data),
    };
    const params = {
      Item: item,
      TableName: this.tableName,
    };
    const request = this.db.putItem(params);
    await request.promise();
  }

  public async deleteItem(options: KeyOptions): Promise<void> {
    const key = this.marshallAttributes(options);
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
    const marshalledAttributes = this.marshallAttributes(options);
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
    const item = result.Items?.[0];
    if (!item) {
      return null;
    }
    const keyOptions = DynamoDB.Converter.unmarshall(item) as KeyOptions;
    return this.getItem(keyOptions);
  }
}

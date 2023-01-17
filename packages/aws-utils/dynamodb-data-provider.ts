import { aws } from './aws';

export type ItemAttributeType = 'S' | 'N' | 'B';

export interface ItemAttribute {
  name: string;
  type: ItemAttributeType;
}

export interface DynamoDBDataProviderOptions {
  dynamodb: AWS.DynamoDB;
  tableName: string;
  attributes: ItemAttribute[];
}

type MarshalledAttribute = {
  [Key in ItemAttributeType]?: string;
};

type MarshalledAttributes = Record<string, MarshalledAttribute>;

export class DynamoDBDataProvider<
  T = any,
  KeyOptions extends Record<string, any> = Record<string, any>,
> {
  private readonly db = aws().dynamoDB();

  constructor(
    public readonly tableName: string,
    private readonly attributes: ItemAttribute[],
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
}

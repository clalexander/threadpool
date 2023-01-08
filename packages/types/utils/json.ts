export type JsonPrimitive = string | number | boolean | null;

export type JsonObject = {
  [Key in string]: JsonValue
} & {
  [Key in string]?: JsonValue | undefined
};

export type JsonArray = JsonValue[];

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

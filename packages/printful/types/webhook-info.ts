export interface WebhookInfo {
  url: string;
  types: string[];
  params: Record<string, any> | []; // am empty array is returned when there are no params
}

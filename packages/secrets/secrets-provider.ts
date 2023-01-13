export interface SecretsProvider {
  getSecret<T>(secretId: string): Promise<T>;
}

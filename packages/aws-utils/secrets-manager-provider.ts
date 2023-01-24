import { CachedSecretsProvider } from 'secrets';
import SuperJSON from 'superjson';
import { aws } from './aws';

export class SecretsManagerProvider extends CachedSecretsProvider {
  protected readonly secretsManager = aws().secretsManager();

  protected async fetchSecret<T>(secretId: string): Promise<T> {
    const response = this.secretsManager.getSecretValue({
      SecretId: secretId,
    });
    const result = await response.promise();
    const stringVal = result.SecretString;
    if (!stringVal) {
      throw new Error(`Secret ${secretId} has no value!`);
    }
    return SuperJSON.parse(stringVal);
  }
}

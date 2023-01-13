import { Cache, caching, MemoryConfig } from 'cache-manager';
import { SecretsProvider } from './secrets-provider';

export abstract class CachedSecretsProvider implements SecretsProvider {
  private internal?: Cache;

  protected abstract fetchSecret<T>(secretId: string): Promise<T>;

  constructor(protected readonly config: MemoryConfig) {
  }

  protected async getCache(): Promise<Cache> {
    if (this.internal === undefined) {
      this.internal = await caching('memory', this.config);
    }
    return this.internal;
  }

  public async getSecret<T>(secretId: string): Promise<T> {
    const cache = await this.getCache();
    return cache.wrap(secretId, async () => this.fetchSecret(secretId));
  }
}

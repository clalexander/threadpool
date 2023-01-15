import { Cache, caching, MemoryConfig } from 'cache-manager';
import { ParametersProvider } from './parameters-provider';

export abstract class CachedParametersProvider implements ParametersProvider {
  private internal?: Cache;

  protected abstract fetchParameter(parameterId: string): Promise<string>;

  constructor(protected readonly config: MemoryConfig) {
  }

  protected async getCache(): Promise<Cache> {
    if (this.internal === undefined) {
      this.internal = await caching('memory', this.config);
    }
    return this.internal;
  }

  public async getParameter(parameterId: string): Promise<string> {
    const cache = await this.getCache();
    return cache.wrap(parameterId, async () => this.fetchParameter(parameterId));
  }
}

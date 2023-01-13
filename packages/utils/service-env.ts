export const ENV_SERVICE_ENV = 'SERVICE_ENV';
export type ServiceEnv = 'local' | 'stage' | 'production';

/**
 * Get the current `ServiceEnv`.
 * This is useful when you don't have access to the NestJS `ConfigService`.
 *
 * @returns {ServiceEnv}
 */
export function envName(): ServiceEnv {
  return process.env[ENV_SERVICE_ENV] as ServiceEnv;
}

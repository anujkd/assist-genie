import type { EnvConfig } from '../types/env.d.ts';

export const env: EnvConfig = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  ENV: import.meta.env.VITE_ENV,
  API_URL: import.meta.env.VITE_API_URL,
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  IS_DEV: import.meta.env.VITE_ENV === 'development',
  IS_PROD: import.meta.env.VITE_ENV === 'production',
} as const;

export function getEnvVar<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
  return env[key];
}

export default env;

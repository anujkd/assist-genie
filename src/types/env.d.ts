export interface ViteEnvConfig {
    readonly VITE_APP_TITLE: string;
    readonly VITE_ENV: 'development' | 'production';
    readonly VITE_API_URL: string;
    readonly VITE_DEBUG_MODE: string;
}
  
export interface ImportMeta {
    readonly env: EnvConfig;
}

export interface EnvConfig {
    readonly APP_TITLE: string;
    readonly ENV: EnvType;
    readonly API_URL: string;
    readonly DEBUG_MODE: boolean;
    readonly IS_DEV: boolean;
    readonly IS_PROD: boolean;
}
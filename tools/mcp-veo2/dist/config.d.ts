export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'none';
declare const config: {
    GOOGLE_API_KEY: string;
    PORT: number;
    STORAGE_DIR: string;
    LOG_LEVEL: "verbose" | "debug" | "info" | "warn" | "error" | "fatal" | "none";
};
export default config;

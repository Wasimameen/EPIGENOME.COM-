import type { LogLevel } from '../config.js';
/**
 * Simple logger utility for the MCP server
 * Respects the LOG_LEVEL environment variable
 */
declare class Logger {
    private currentLogLevel;
    /**
     * Initialize the logger with the configured log level
     * This should be called after config is loaded to avoid circular dependencies
     *
     * @param logLevel The log level from configuration
     */
    initialize(logLevel: LogLevel): void;
    /**
     * Log a verbose message
     *
     * @param message The message to log
     * @param data Optional data to include
     */
    verbose(message: string, data?: any): void;
    /**
     * Log a debug message
     *
     * @param message The message to log
     * @param data Optional data to include
     */
    debug(message: string, data?: any): void;
    /**
     * Log an info message
     *
     * @param message The message to log
     * @param data Optional data to include
     */
    info(message: string, data?: any): void;
    /**
     * Log a warning message
     *
     * @param message The message to log
     * @param data Optional data to include
     */
    warn(message: string, data?: any): void;
    /**
     * Log an error message
     *
     * @param message The message to log
     * @param data Optional data to include
     */
    error(message: string, data?: any): void;
    /**
     * Log a fatal message
     *
     * @param message The message to log
     * @param data Optional data to include
     */
    fatal(message: string, data?: any): void;
    /**
     * Check if a log level should be displayed based on the current log level setting
     *
     * @param level The log level to check
     * @returns True if the log level should be displayed
     */
    private shouldLog;
    /**
     * Log a message with a specific level
     * Only logs messages at or above the configured log level
     *
     * @param level The log level
     * @param message The message to log
     * @param data Optional data to include
     */
    private logWithLevel;
}
export declare const log: Logger;
export {};

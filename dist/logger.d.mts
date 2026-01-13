/**
 * Simple Logger Utility
 *
 * A minimal, zero-dependency logger for consistent logging across environments.
 *
 * @license MIT
 */
interface Logger {
    debug: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
}
declare class SimpleLogger implements Logger {
    private log;
    /**
     * Log a debug message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    debug(message: string, ...args: unknown[]): void;
    /**
     * Log an info message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    info(message: string, ...args: unknown[]): void;
    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    warn(message: string, ...args: unknown[]): void;
    /**
     * Log an error message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    error(message: string, ...args: unknown[]): void;
}
/**
 * Singleton logger instance
 *
 * @example
 * ```typescript
 * import { logger } from '@affectively/utils/logger';
 *
 * logger.info('Application started');
 * logger.error('Failed to load', error);
 * ```
 */
declare const logger: SimpleLogger;

export { logger };

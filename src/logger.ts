/**
 * Simple Logger Utility
 *
 * A minimal, zero-dependency logger for consistent logging across environments.
 *
 * @license MIT
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
    debug: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
}

class SimpleLogger implements Logger {
    private log(level: LogLevel, message: string, ...args: unknown[]): void {
        if (typeof console !== 'undefined' && console[level]) {
            console[level](`[${level.toUpperCase()}]`, message, ...args);
        }
    }

    /**
     * Log a debug message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    debug(message: string, ...args: unknown[]): void {
        this.log('debug', message, ...args);
    }

    /**
     * Log an info message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    info(message: string, ...args: unknown[]): void {
        this.log('info', message, ...args);
    }

    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    warn(message: string, ...args: unknown[]): void {
        this.log('warn', message, ...args);
    }

    /**
     * Log an error message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    error(message: string, ...args: unknown[]): void {
        this.log('error', message, ...args);
    }
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
export const logger = new SimpleLogger();

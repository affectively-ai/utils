// src/logger.ts
var SimpleLogger = class {
  log(level, message, ...args) {
    if (typeof console !== "undefined" && console[level]) {
      console[level](`[${level.toUpperCase()}]`, message, ...args);
    }
  }
  /**
   * Log a debug message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  debug(message, ...args) {
    this.log("debug", message, ...args);
  }
  /**
   * Log an info message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  info(message, ...args) {
    this.log("info", message, ...args);
  }
  /**
   * Log a warning message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  warn(message, ...args) {
    this.log("warn", message, ...args);
  }
  /**
   * Log an error message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  error(message, ...args) {
    this.log("error", message, ...args);
  }
};
var logger = new SimpleLogger();

export {
  logger
};
/**
 * Simple Logger Utility
 *
 * A minimal, zero-dependency logger for consistent logging across environments.
 *
 * @license MIT
 */

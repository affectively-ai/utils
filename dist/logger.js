"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/logger.ts
var logger_exports = {};
__export(logger_exports, {
  logger: () => logger
});
module.exports = __toCommonJS(logger_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  logger
});
/**
 * Simple Logger Utility
 *
 * A minimal, zero-dependency logger for consistent logging across environments.
 *
 * @license MIT
 */

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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createShortUrl: () => createShortUrl,
  fetchJsonWithRetry: () => fetchJsonWithRetry,
  fetchWithRetry: () => fetchWithRetry,
  generateShortCode: () => generateShortCode,
  logger: () => logger
});
module.exports = __toCommonJS(index_exports);

// src/api-retry.ts
function defaultIsAuthError(response) {
  return response.status === 401;
}
function headersToObject(headers) {
  const result = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
function arrayHeadersToObject(headers) {
  const result = {};
  for (const headerPair of headers) {
    const [key, value] = headerPair;
    result[key] = value;
  }
  return result;
}
function buildHeadersObject(options) {
  const headersObject = {};
  if (!options.headers) {
    return headersObject;
  }
  if (options.headers instanceof Headers) {
    return headersToObject(options.headers);
  }
  if (Array.isArray(options.headers)) {
    return arrayHeadersToObject(options.headers);
  }
  if (typeof options.headers === "object") {
    return { ...options.headers };
  }
  return headersObject;
}
async function makeFetchAttempt(url, options, getToken) {
  const token = await getToken();
  const headersObject = buildHeadersObject(options);
  if (token) {
    headersObject["Authorization"] = `Bearer ${token}`;
  }
  const { headers: _, ...optionsWithoutHeaders } = options;
  const fetchOptions = {
    ...optionsWithoutHeaders,
    headers: headersObject
  };
  return fetch(url, fetchOptions);
}
async function fetchWithRetry(url, options = {}, retryOptions) {
  const {
    maxRetries = 1,
    getToken,
    isAuthError = defaultIsAuthError
  } = retryOptions;
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await makeFetchAttempt(url, options, getToken);
      if (isAuthError(response) && attempt < maxRetries) {
        attempt++;
        continue;
      }
      if (isAuthError(response)) {
        throw new Error(
          `Authentication failed after ${maxRetries} retry attempts`
        );
      }
      return response;
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
  throw new Error("Request failed after retries");
}
async function fetchJsonWithRetry(url, options = {}, retryOptions) {
  const response = await fetchWithRetry(url, options, retryOptions);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

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

// src/short-url.ts
var SHORT_CODE_LENGTH = 8;
var BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function getRandomBytes(length) {
  if (typeof globalThis !== "undefined" && typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
    const array = new Uint8Array(length);
    globalThis.crypto.getRandomValues(array);
    return array;
  }
  let crypto = null;
  if (typeof require !== "undefined") {
    try {
      crypto = require("crypto");
    } catch {
      crypto = null;
    }
  }
  if (crypto && typeof crypto.randomBytes === "function") {
    return crypto.randomBytes(
      length
    );
  }
  throw new Error("No secure random number generator available.");
}
function generateShortCode() {
  const bytes = getRandomBytes(SHORT_CODE_LENGTH);
  return Array.from(bytes).map((byteValue) => {
    const index = byteValue % BASE62_CHARS.length;
    return BASE62_CHARS.charAt(index);
  }).join("");
}
function createShortUrl(shortCode, baseUrl) {
  const base = baseUrl || (typeof process !== "undefined" ? process.env?.["NEXT_PUBLIC_BASE_URL"] : void 0) || "https://affectively.app";
  return `${base}/s/${shortCode}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createShortUrl,
  fetchJsonWithRetry,
  fetchWithRetry,
  generateShortCode,
  logger
});
/**
 * API Retry Utility
 *
 * Provides automatic retry logic for API requests that fail with 401 errors.
 * Works with Firebase Auth's automatic token refresh mechanism.
 *
 * @license MIT
 */
/**
 * Simple Logger Utility
 *
 * A minimal, zero-dependency logger for consistent logging across environments.
 *
 * @license MIT
 */
/**
 * Short URL Utility
 *
 * Generates cryptographically secure short codes for URL shortening.
 *
 * @license MIT
 */
/**
 * @affectively/utils
 *
 * TypeScript utility functions for common development tasks.
 *
 * @license MIT
 * @see https://github.com/affectively-ai/utils
 */

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

// src/api-retry.ts
var api_retry_exports = {};
__export(api_retry_exports, {
  fetchJsonWithRetry: () => fetchJsonWithRetry,
  fetchWithRetry: () => fetchWithRetry
});
module.exports = __toCommonJS(api_retry_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchJsonWithRetry,
  fetchWithRetry
});
/**
 * API Retry Utility
 *
 * Provides automatic retry logic for API requests that fail with 401 errors.
 * Works with Firebase Auth's automatic token refresh mechanism.
 *
 * @license MIT
 */

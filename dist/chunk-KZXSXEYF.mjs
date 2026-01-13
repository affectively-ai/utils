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

export {
  fetchWithRetry,
  fetchJsonWithRetry
};
/**
 * API Retry Utility
 *
 * Provides automatic retry logic for API requests that fail with 401 errors.
 * Works with Firebase Auth's automatic token refresh mechanism.
 *
 * @license MIT
 */

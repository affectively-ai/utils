/**
 * API Retry Utility
 *
 * Provides automatic retry logic for API requests that fail with 401 errors.
 * Works with Firebase Auth's automatic token refresh mechanism.
 *
 * @license MIT
 */

export interface RetryOptions {
    /**
     * Maximum number of retry attempts (default: 1)
     */
    maxRetries?: number;
    /**
     * Function to get a fresh authentication token
     */
    getToken: () => Promise<string | null>;
    /**
     * Function to check if a response indicates an authentication error
     */
    isAuthError?: (response: Response) => boolean;
}

/**
 * Default function to check if a response is an authentication error
 */
function defaultIsAuthError(response: Response): boolean {
    return response.status === 401;
}

/**
 * Convert Headers object to plain object
 */
function headersToObject(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value: string, key: string) => {
        result[key] = value;
    });
    return result;
}

/**
 * Convert array of [key, value] pairs to plain object
 */
function arrayHeadersToObject(
    headers: [string, string][]
): Record<string, string> {
    const result: Record<string, string> = {};
    for (const headerPair of headers) {
        const [key, value] = headerPair;
        result[key] = value;
    }
    return result;
}

/**
 * Build headers object from various RequestInit header formats
 */
function buildHeadersObject(options: RequestInit): Record<string, string> {
    const headersObject: Record<string, string> = {};

    if (!options.headers) {
        return headersObject;
    }

    if (options.headers instanceof Headers) {
        return headersToObject(options.headers);
    }

    if (Array.isArray(options.headers)) {
        return arrayHeadersToObject(options.headers);
    }

    if (typeof options.headers === 'object') {
        return { ...(options.headers as Record<string, string>) };
    }

    return headersObject;
}

/**
 * Make a single fetch attempt with authentication
 */
async function makeFetchAttempt(
    url: string,
    options: RequestInit,
    getToken: () => Promise<string | null>
): Promise<Response> {
    const token = await getToken();
    const headersObject = buildHeadersObject(options);

    if (token) {
        headersObject['Authorization'] = `Bearer ${token}`;
    }

    const { headers: _, ...optionsWithoutHeaders } = options;
    const fetchOptions: RequestInit = {
        ...optionsWithoutHeaders,
        headers: headersObject,
    };

    return fetch(url, fetchOptions);
}

/**
 * Make an API request with automatic retry on authentication errors
 *
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param retryOptions - Retry configuration
 * @returns The response from the API
 *
 * @example
 * ```typescript
 * const response = await fetchWithRetry('/api/data', {
 *   method: 'GET'
 * }, {
 *   maxRetries: 3,
 *   getToken: async () => localStorage.getItem('token')
 * });
 * ```
 */
export async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retryOptions: RetryOptions
): Promise<Response> {
    const {
        maxRetries = 1,
        getToken,
        isAuthError = defaultIsAuthError,
    } = retryOptions;

    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const response = await makeFetchAttempt(url, options, getToken);

            // If it's an auth error and we have retries left, try again
            if (isAuthError(response) && attempt < maxRetries) {
                attempt++;
                continue;
            }

            // If it's still an auth error after max retries, throw an error
            if (isAuthError(response)) {
                throw new Error(
                    `Authentication failed after ${maxRetries} retry attempts`
                );
            }

            // Return the response (success)
            return response;
        } catch (error) {
            // Don't retry on network errors, only on auth errors
            // Network errors should be thrown immediately
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    // Should never reach here, but TypeScript needs it
    throw new Error('Request failed after retries');
}

/**
 * Make an API request with automatic retry and JSON parsing
 *
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param retryOptions - Retry configuration
 * @returns The parsed JSON response
 *
 * @example
 * ```typescript
 * interface User { id: string; name: string; }
 * const user = await fetchJsonWithRetry<User>('/api/user', {}, retryOptions);
 * ```
 */
export async function fetchJsonWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retryOptions: RetryOptions
): Promise<T> {
    const response = await fetchWithRetry(url, options, retryOptions);

    if (!response.ok) {
        const error = (await response
            .json()
            .catch(() => ({ error: 'Unknown error' }))) as {
                message?: string;
                error?: string;
            };

        throw new Error(error.message || error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

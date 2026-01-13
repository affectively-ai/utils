/**
 * API Retry Utility
 *
 * Provides automatic retry logic for API requests that fail with 401 errors.
 * Works with Firebase Auth's automatic token refresh mechanism.
 *
 * @license MIT
 */
interface RetryOptions {
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
declare function fetchWithRetry(url: string, options: RequestInit | undefined, retryOptions: RetryOptions): Promise<Response>;
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
declare function fetchJsonWithRetry<T>(url: string, options: RequestInit | undefined, retryOptions: RetryOptions): Promise<T>;

export { type RetryOptions, fetchJsonWithRetry, fetchWithRetry };

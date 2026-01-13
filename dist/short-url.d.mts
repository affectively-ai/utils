/**
 * Short URL Utility
 *
 * Generates cryptographically secure short codes for URL shortening.
 *
 * @license MIT
 */
/**
 * Generate a random short code
 *
 * Generates an 8-character base62 code using cryptographically
 * secure random bytes. Safe for use in URLs.
 *
 * @returns An 8-character base62 string
 *
 * @example
 * ```typescript
 * const code = generateShortCode(); // "xK9mN2pL"
 * ```
 */
declare function generateShortCode(): string;
/**
 * Create a short URL from a short code
 *
 * @param shortCode - The generated short code
 * @param baseUrl - Optional base URL (defaults to process.env.NEXT_PUBLIC_BASE_URL or 'https://affectively.app')
 * @returns The full short URL
 *
 * @example
 * ```typescript
 * const url = createShortUrl('xK9mN2pL', 'https://mysite.com');
 * // Returns: "https://mysite.com/s/xK9mN2pL"
 * ```
 */
declare function createShortUrl(shortCode: string, baseUrl?: string): string;

export { createShortUrl, generateShortCode };

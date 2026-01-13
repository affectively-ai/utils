/**
 * Short URL Utility
 *
 * Generates cryptographically secure short codes for URL shortening.
 *
 * @license MIT
 */

const SHORT_CODE_LENGTH = 8;
const BASE62_CHARS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Generate random bytes using Web Crypto API (browser) or Node.js crypto
 */
function getRandomBytes(length: number): Uint8Array {
    // Use Web Crypto API if available (browser/Deno/Bun)
    if (
        typeof globalThis !== 'undefined' &&
        typeof globalThis.crypto !== 'undefined' &&
        typeof globalThis.crypto.getRandomValues === 'function'
    ) {
        const array = new Uint8Array(length);
        globalThis.crypto.getRandomValues(array);
        return array;
    }

    // Fallback to Node.js crypto for server-side
    // Use dynamic require to avoid bundler issues
    let crypto: unknown = null;
    if (typeof require !== 'undefined') {
        try {
            crypto = require('crypto');
        } catch {
            crypto = null;
        }
    }
    if (
        crypto &&
        typeof (crypto as { randomBytes?: unknown }).randomBytes === 'function'
    ) {
        return (crypto as { randomBytes: (n: number) => Uint8Array }).randomBytes(
            length
        );
    }
    throw new Error('No secure random number generator available.');
}

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
export function generateShortCode(): string {
    const bytes = getRandomBytes(SHORT_CODE_LENGTH);
    return Array.from(bytes)
        .map((byteValue) => {
            const index = byteValue % BASE62_CHARS.length;
            return BASE62_CHARS.charAt(index);
        })
        .join('');
}

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
export function createShortUrl(shortCode: string, baseUrl?: string): string {
    const base =
        baseUrl ||
        (typeof process !== 'undefined'
            ? process.env?.['NEXT_PUBLIC_BASE_URL']
            : undefined) ||
        'https://affectively.app';
    return `${base}/s/${shortCode}`;
}

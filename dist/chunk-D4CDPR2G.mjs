import {
  __require
} from "./chunk-Y6FXYEAI.mjs";

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
  if (typeof __require !== "undefined") {
    try {
      crypto = __require("crypto");
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

export {
  generateShortCode,
  createShortUrl
};
/**
 * Short URL Utility
 *
 * Generates cryptographically secure short codes for URL shortening.
 *
 * @license MIT
 */

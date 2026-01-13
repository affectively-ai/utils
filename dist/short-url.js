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

// src/short-url.ts
var short_url_exports = {};
__export(short_url_exports, {
  createShortUrl: () => createShortUrl,
  generateShortCode: () => generateShortCode
});
module.exports = __toCommonJS(short_url_exports);
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
  generateShortCode
});
/**
 * Short URL Utility
 *
 * Generates cryptographically secure short codes for URL shortening.
 *
 * @license MIT
 */

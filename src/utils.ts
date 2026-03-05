import { createHash } from 'node:crypto';
import type { CiniiSearchParams } from './models/index.js';

/**
 * Builds a URL query string from the given search parameters.
 * Ignores undefined, null, and empty string values.
 *
 * @param params - The search parameters object.
 * @returns The formatted query string starting with '?', or an empty string if no parameters exist.
 */
export function buildQueryString(params: CiniiSearchParams): string {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Generates a SHA-256 hash for the given input string.
 * Used primarily for generating unique cache keys based on requested URLs.
 *
 * @param input - The string to hash.
 * @returns The hex representation of the SHA-256 hash.
 */
export function generateCacheKey(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

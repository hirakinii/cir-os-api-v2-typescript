import { createHash } from 'node:crypto';
import type { CiniiSearchParams } from './models/index.js';

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

export function generateCacheKey(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

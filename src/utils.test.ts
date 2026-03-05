import { describe, it, expect } from 'vitest';
import { buildQueryString, generateCacheKey } from './utils.js';
import type { CiniiSearchParams } from './models/index.js';

describe('utils', () => {
  describe('buildQueryString', () => {
    it('should build a query string from parameters', () => {
      const params: CiniiSearchParams = {
        appid: 'test-app-id',
        count: 20,
        lang: 'ja',
        format: 'json',
        title: 'テスト',
      };
      const queryString = buildQueryString(params);
      expect(queryString).toContain('appid=test-app-id');
      expect(queryString).toContain('count=20');
      expect(queryString).toContain('lang=ja');
      expect(queryString).toContain('format=json');
      expect(queryString).toContain('title=%E3%83%86%E3%82%B9%E3%83%88');
      expect(queryString.startsWith('?')).toBe(true);
    });

    it('should ignore undefined, null, and empty string values', () => {
      const params: CiniiSearchParams = {
        appid: 'test',
        count: undefined,
        lang: '',
        format: 'json',
      };
      const queryString = buildQueryString(params);
      expect(queryString).toBe('?appid=test&format=json');
    });

    it('should return empty string for empty parameters', () => {
      expect(buildQueryString({})).toBe('');
    });
  });

  describe('generateCacheKey', () => {
    it('should generate a consistent SHA-256 hash', () => {
      const input = 'https://api.example.com/test?param=1';
      const hash1 = generateCacheKey(input);
      const hash2 = generateCacheKey(input);
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 hex string length
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = generateCacheKey('input1');
      const hash2 = generateCacheKey('input2');
      expect(hash1).not.toBe(hash2);
    });
  });
});

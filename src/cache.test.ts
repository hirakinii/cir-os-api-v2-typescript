import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { CacheManager } from './cache.js';

describe('CacheManager', () => {
  let cacheDir: string;
  let cacheManager: CacheManager;

  beforeEach(async () => {
    cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cinii-api-cache-test-'));
    cacheManager = new CacheManager(cacheDir);
  });

  afterEach(async () => {
    await fs.rm(cacheDir, { recursive: true, force: true });
  });

  it('should set and get cache successfully', async () => {
    const url = 'https://api.example.com/test';
    const data = { message: 'success' };

    await cacheManager.set(url, data);
    const cachedData = await cacheManager.get<{ message: string }>(url);

    expect(cachedData).toEqual(data);
  });

  it('should return null for non-existent cache', async () => {
    const url = 'https://api.example.com/not-found';
    const cachedData = await cacheManager.get(url);

    expect(cachedData).toBeNull();
  });

  it('should clear all cache files', async () => {
    const url1 = 'https://api.example.com/1';
    const url2 = 'https://api.example.com/2';

    await cacheManager.set(url1, { id: 1 });
    await cacheManager.set(url2, { id: 2 });

    await cacheManager.clear();

    expect(await cacheManager.get(url1)).toBeNull();
    expect(await cacheManager.get(url2)).toBeNull();
  });

  it('should handle permission errors gracefully when setting cache', async () => {
    // Create a read-only directory to simulate permission error
    const readOnlyDir = path.join(cacheDir, 'readonly');
    await fs.mkdir(readOnlyDir, { mode: 0o444 });
    const localCacheManager = new CacheManager(readOnlyDir);

    const url = 'https://api.example.com/test';
    const data = { message: 'success' };

    // Should not throw an error (console.warn might be triggered, which is expected)
    await localCacheManager.set(url, data);

    // Get should return null since writing failed
    const cachedData = await localCacheManager.get(url);
    expect(cachedData).toBeNull();
  });
});

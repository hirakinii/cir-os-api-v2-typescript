import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseApi } from './base.js';
import { CiniiApiRequestError, CiniiApiResponseError } from '../exceptions.js';
import { CacheManager } from '../cache.js';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

class TestApi extends BaseApi {
  protected endpoint = 'test-endpoint';
}

describe('BaseApi', () => {
  let cacheDir: string;
  let cacheManager: CacheManager;
  let api: TestApi;

  beforeEach(async () => {
    cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cinii-api-base-test-'));
    cacheManager = new CacheManager(cacheDir);
    api = new TestApi('test-app-id', 1000, 1, cacheManager);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ title: 'Success', items: [] }),
      }),
    );
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(cacheDir, { recursive: true, force: true });
  });

  it('should make a successful search request and cache the result', async () => {
    const result = await api.search({ title: 'Query' });
    expect(result.title).toBe('Success');

    expect(fetch).toHaveBeenCalledTimes(1);

    // Call again to hit the cache
    const cachedResult = await api.search({ title: 'Query' });
    expect(cachedResult.title).toBe('Success');

    // Fetch should not be called again
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on network error and then throw CiniiApiRequestError', async () => {
    const failingApi = new TestApi('test-app-id', 1000, 2, null);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Failure')));

    await expect(failingApi.search({ title: 'Query' })).rejects.toThrow(CiniiApiRequestError);
    // Initial call + 2 retries = 3 calls
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('should throw CiniiApiRequestError when response status is not ok', async () => {
    const failingApi = new TestApi('test-app-id', 1000, 1, null);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(failingApi.search({ title: 'Query' })).rejects.toThrowError(
      new CiniiApiRequestError('Request failed with status 404', 404),
    );
  });

  it('should throw CiniiApiResponseError when JSON parsing fails', async () => {
    const badJsonApi = new TestApi('test-app-id', 1000, 0, null);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Unexpected token < in JSON')),
      }),
    );

    await expect(badJsonApi.search({ title: 'Query' })).rejects.toThrow(CiniiApiResponseError);
  });
});

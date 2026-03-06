import { promises as fs } from 'node:fs';
import path from 'node:path';
import { generateCacheKey } from './utils.js';

/**
 * Manages file-system based caching for API responses.
 */
export class CacheManager {
  private cacheDir: string;

  /**
   * Initializes the CacheManager with a specific directory.
   *
   * @param cacheDir - The path to the directory where cache files will be stored.
   */
  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
  }

  /**
   * Ensures the cache directory exists, creating it if necessary.
   */
  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.warn(`Failed to create cache directory at ${this.cacheDir}:`, error);
      // We don't throw to allow fallback mechanism (bypass cache)
    }
  }

  /**
   * Constructs the file path for a given cache key.
   *
   * @param key - The cache key.
   * @returns The full path to the cache file.
   */
  private getCacheFilePath(key: string): string {
    return path.join(this.cacheDir, `${key}.json`);
  }

  /**
   * Retrieves cached data for a specific URL, if it exists.
   *
   * @template T The expected type of the cached data.
   * @param url - The URL used to generate the cache key.
   * @returns The cached data, or null if the cache does not exist or cannot be read.
   */
  public async get<T>(url: string): Promise<T | null> {
    const key = generateCacheKey(url);
    const filePath = this.getCacheFilePath(key);

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        console.warn(`Failed to read cache file ${filePath}:`, error);
      }
      return null;
    }
  }

  /**
   * Saves data to the cache for a specific URL.
   *
   * @template T The type of the data being cached.
   * @param url - The URL used to generate the cache key.
   * @param data - The data to cache.
   */
  public async set<T>(url: string, data: T): Promise<void> {
    await this.ensureCacheDir();
    const key = generateCacheKey(url);
    const filePath = this.getCacheFilePath(key);

    try {
      await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.warn(`Failed to write cache file ${filePath}:`, error);
    }
  }

  /**
   * Clears all cached files within the configured cache directory.
   */
  public async clear(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      await Promise.all(
        files.map(async (file) => {
          if (file.endsWith('.json')) {
            await fs.unlink(path.join(this.cacheDir, file));
          }
        }),
      );
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        console.warn(`Failed to clear cache directory ${this.cacheDir}:`, error);
      }
    }
  }
}

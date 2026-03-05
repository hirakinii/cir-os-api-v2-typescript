import { promises as fs } from 'node:fs';
import path from 'node:path';
import { generateCacheKey } from './utils.js';

export class CacheManager {
  private cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
  }

  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.warn(`Failed to create cache directory at ${this.cacheDir}:`, error);
      // We don't throw to allow fallback mechanism (bypass cache)
    }
  }

  private getCacheFilePath(key: string): string {
    return path.join(this.cacheDir, `${key}.json`);
  }

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

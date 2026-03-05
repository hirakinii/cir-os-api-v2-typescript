import os from 'node:os';
import path from 'node:path';
import type { CiniiApiClientOptions } from './models/index.js';
import { CacheManager } from './cache.js';
import {
  AllApi,
  ProjectsAndProductsApi,
  DataApi,
  ArticlesApi,
  BooksApi,
  DissertationsApi,
  ProjectsApi,
  ResearchersApi,
} from './api/index.js';

export class CiniiApiClient {
  private cacheManager: CacheManager | null = null;

  public readonly all: AllApi;
  public readonly projectsAndProducts: ProjectsAndProductsApi;
  public readonly data: DataApi;
  public readonly articles: ArticlesApi;
  public readonly books: BooksApi;
  public readonly dissertations: DissertationsApi;
  public readonly projects: ProjectsApi;
  public readonly researchers: ResearchersApi;

  constructor(options: CiniiApiClientOptions) {
    const useCache = options.useCache ?? true;

    if (useCache) {
      const cacheDir = options.cacheDir || path.join(os.homedir(), '.cinii_api_cache');
      this.cacheManager = new CacheManager(cacheDir);
    }

    const { appId, timeout, maxRetries } = options;

    this.all = new AllApi(appId, timeout, maxRetries, this.cacheManager);
    this.projectsAndProducts = new ProjectsAndProductsApi(
      appId,
      timeout,
      maxRetries,
      this.cacheManager,
    );
    this.data = new DataApi(appId, timeout, maxRetries, this.cacheManager);
    this.articles = new ArticlesApi(appId, timeout, maxRetries, this.cacheManager);
    this.books = new BooksApi(appId, timeout, maxRetries, this.cacheManager);
    this.dissertations = new DissertationsApi(appId, timeout, maxRetries, this.cacheManager);
    this.projects = new ProjectsApi(appId, timeout, maxRetries, this.cacheManager);
    this.researchers = new ResearchersApi(appId, timeout, maxRetries, this.cacheManager);
  }

  public async clearCache(): Promise<void> {
    if (this.cacheManager) {
      await this.cacheManager.clear();
    }
  }
}

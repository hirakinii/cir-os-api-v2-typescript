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

/**
 * The main client for interacting with the CiNii Research OpenSearch API.
 * Provides access to various endpoints such as articles, books, researchers, etc.
 */
export class CiniiApiClient {
  private cacheManager: CacheManager | null = null;

  /** Access to the "all" search endpoint. */
  public readonly all: AllApi;
  /** Access to the "projectsAndProducts" search endpoint. */
  public readonly projectsAndProducts: ProjectsAndProductsApi;
  /** Access to the "data" search endpoint. */
  public readonly data: DataApi;
  /** Access to the "articles" search endpoint. */
  public readonly articles: ArticlesApi;
  /** Access to the "books" search endpoint. */
  public readonly books: BooksApi;
  /** Access to the "dissertations" search endpoint. */
  public readonly dissertations: DissertationsApi;
  /** Access to the "projects" search endpoint. */
  public readonly projects: ProjectsApi;
  /** Access to the "researchers" search endpoint. */
  public readonly researchers: ResearchersApi;

  /**
   * Initializes the CiNii API Client.
   *
   * @param options - Configuration options including the mandatory appId.
   */
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

  /**
   * Clears the API response cache entirely.
   */
  public async clearCache(): Promise<void> {
    if (this.cacheManager) {
      await this.cacheManager.clear();
    }
  }
}

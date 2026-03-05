import { ENDPOINTS, DEFAULTS } from '../constants.js';
import { CiniiApiRequestError, CiniiApiResponseError } from '../exceptions.js';
import type { CiniiApiResponse, CiniiSearchParams } from '../models/index.js';
import type { CacheManager } from '../cache.js';
import { buildQueryString } from '../utils.js';

export abstract class BaseApi {
  protected abstract endpoint: string;

  constructor(
    protected readonly appId: string,
    protected readonly timeout: number = 30000,
    protected readonly maxRetries: number = 3,
    protected readonly cacheManager: CacheManager | null = null,
  ) {}

  protected async fetchWithRetry(url: string, retries: number): Promise<Response> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.timeout);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) {
        throw new CiniiApiRequestError(
          `Request failed with status ${response.status}`,
          response.status,
        );
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        const backoff = Math.pow(2, this.maxRetries - retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return this.fetchWithRetry(url, retries - 1);
      }

      if (error instanceof CiniiApiRequestError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Unknown network error';
      throw new CiniiApiRequestError(`Network error: ${message}`);
    }
  }

  public async search<T>(params: CiniiSearchParams): Promise<CiniiApiResponse<T>> {
    const fullParams: CiniiSearchParams = {
      appid: this.appId,
      format: DEFAULTS.FORMAT,
      lang: DEFAULTS.LANG,
      count: DEFAULTS.COUNT,
      ...params,
    };

    const queryString = buildQueryString(fullParams);
    const url = `${ENDPOINTS.BASE_URL}${this.endpoint}${queryString}`;

    if (this.cacheManager) {
      const cachedData = await this.cacheManager.get<CiniiApiResponse<T>>(url);
      if (cachedData) {
        return cachedData;
      }
    }

    const response = await this.fetchWithRetry(url, this.maxRetries);

    try {
      const data = (await response.json()) as CiniiApiResponse<T>;
      if (this.cacheManager) {
        await this.cacheManager.set(url, data);
      }
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse JSON response';
      throw new CiniiApiResponseError(`Response error: ${message}`);
    }
  }
}

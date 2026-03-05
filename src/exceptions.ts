/**
 * Base class for all CiNii API related errors.
 */
export class CiniiApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CiniiApiError';
  }
}

/**
 * Error thrown when an API request fails (e.g. network failure or non-2xx status).
 */
export class CiniiApiRequestError extends CiniiApiError {
  /** The HTTP status code, if available. */
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'CiniiApiRequestError';
    this.statusCode = statusCode;
  }
}

/**
 * Error thrown when an API response is invalid or cannot be parsed.
 */
export class CiniiApiResponseError extends CiniiApiError {
  constructor(message: string) {
    super(message);
    this.name = 'CiniiApiResponseError';
  }
}

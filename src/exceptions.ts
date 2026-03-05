export class CiniiApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CiniiApiError';
  }
}

export class CiniiApiRequestError extends CiniiApiError {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'CiniiApiRequestError';
    this.statusCode = statusCode;
  }
}

export class CiniiApiResponseError extends CiniiApiError {
  constructor(message: string) {
    super(message);
    this.name = 'CiniiApiResponseError';
  }
}

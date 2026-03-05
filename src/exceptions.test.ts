import { describe, it, expect } from 'vitest';
import { CiniiApiError, CiniiApiRequestError, CiniiApiResponseError } from './exceptions.js';

describe('CiniiApiError', () => {
  it('should create an error with the correct name and message', () => {
    const error = new CiniiApiError('Base error');
    expect(error.name).toBe('CiniiApiError');
    expect(error.message).toBe('Base error');
    expect(error instanceof Error).toBe(true);
  });
});

describe('CiniiApiRequestError', () => {
  it('should create an error with the correct name, message, and statusCode', () => {
    const error = new CiniiApiRequestError('Request failed', 404);
    expect(error.name).toBe('CiniiApiRequestError');
    expect(error.message).toBe('Request failed');
    expect(error.statusCode).toBe(404);
    expect(error instanceof CiniiApiError).toBe(true);
  });

  it('should handle missing statusCode', () => {
    const error = new CiniiApiRequestError('Network error');
    expect(error.statusCode).toBeUndefined();
  });
});

describe('CiniiApiResponseError', () => {
  it('should create an error with the correct name and message', () => {
    const error = new CiniiApiResponseError('Parse failed');
    expect(error.name).toBe('CiniiApiResponseError');
    expect(error.message).toBe('Parse failed');
    expect(error instanceof CiniiApiError).toBe(true);
  });
});

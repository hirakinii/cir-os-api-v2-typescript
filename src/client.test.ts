import { describe, it, expect } from 'vitest';
import { CiniiApiClient } from './client.js';

describe('CiniiApiClient', () => {
  it('should initialize all API endpoints', () => {
    const client = new CiniiApiClient({ appId: 'test-app-id', useCache: false });

    expect(client.all).toBeDefined();
    expect(client.projectsAndProducts).toBeDefined();
    expect(client.data).toBeDefined();
    expect(client.articles).toBeDefined();
    expect(client.books).toBeDefined();
    expect(client.dissertations).toBeDefined();
    expect(client.projects).toBeDefined();
    expect(client.researchers).toBeDefined();
  });

  it('should correctly initialize with default cache directory', () => {
    const client = new CiniiApiClient({ appId: 'test-app-id' });
    expect(client).toBeDefined();
  });
});

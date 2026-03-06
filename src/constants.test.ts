import { describe, it, expect } from 'vitest';
import { ENDPOINTS, SEARCH_TYPES, DEFAULTS } from './constants.js';

describe('Constants', () => {
  it('should define ENDPOINTS', () => {
    expect(ENDPOINTS.BASE_URL).toBe('https://cir.nii.ac.jp/opensearch/v2/');
  });

  it('should define SEARCH_TYPES', () => {
    expect(SEARCH_TYPES.ARTICLES).toBe('articles');
    expect(SEARCH_TYPES.ALL).toBe('all');
    expect(SEARCH_TYPES.PROJECTS_AND_PRODUCTS).toBe('projectsAndProducts');
    expect(SEARCH_TYPES.DATA).toBe('data');
    expect(SEARCH_TYPES.BOOKS).toBe('books');
    expect(SEARCH_TYPES.DISSERTATIONS).toBe('dissertations');
    expect(SEARCH_TYPES.PROJECTS).toBe('projects');
    expect(SEARCH_TYPES.RESEARCHERS).toBe('researchers');
  });

  it('should define DEFAULTS', () => {
    expect(DEFAULTS.FORMAT).toBe('json');
    expect(DEFAULTS.LANG).toBe('ja');
    expect(DEFAULTS.COUNT).toBe(20);
  });
});

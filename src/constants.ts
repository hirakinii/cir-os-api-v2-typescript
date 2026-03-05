/**
 * API Endpoint Constants.
 */
export const ENDPOINTS = {
  /** The base URL for CiR-OS v2 API. */
  BASE_URL: 'https://cir.nii.ac.jp/opensearch/v2/',
} as const;

/**
 * Search types supported by the CiNii Research API.
 */
export const SEARCH_TYPES = {
  ALL: 'all',
  PROJECTS_AND_PRODUCTS: 'projectsAndProducts',
  DATA: 'data',
  ARTICLES: 'articles',
  BOOKS: 'books',
  DISSERTATIONS: 'dissertations',
  PROJECTS: 'projects',
  RESEARCHERS: 'researchers',
} as const;

/**
 * Default parameter values for API requests.
 */
export const DEFAULTS = {
  /** Default response format. */
  FORMAT: 'json',
  /** Default response language. */
  LANG: 'ja',
  /** Default items per page. */
  COUNT: 20,
} as const;

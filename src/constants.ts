export const ENDPOINTS = {
  BASE_URL: 'https://cir.nii.ac.jp/opensearch/v2/',
} as const;

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

export const DEFAULTS = {
  FORMAT: 'json',
  LANG: 'ja',
  COUNT: 20,
} as const;

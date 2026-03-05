import { SEARCH_TYPES } from '../constants.js';
import { BaseApi } from './base.js';

/** API service for searching across all types. */
export class AllApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.ALL;
}

/** API service for searching projects and products. */
export class ProjectsAndProductsApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.PROJECTS_AND_PRODUCTS;
}

/** API service for searching research data. */
export class DataApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.DATA;
}

/** API service for searching articles. */
export class ArticlesApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.ARTICLES;
}

/** API service for searching books. */
export class BooksApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.BOOKS;
}

/** API service for searching dissertations. */
export class DissertationsApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.DISSERTATIONS;
}

/** API service for searching projects. */
export class ProjectsApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.PROJECTS;
}

/** API service for searching researchers. */
export class ResearchersApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.RESEARCHERS;
}

import { SEARCH_TYPES } from '../constants.js';
import { BaseApi } from './base.js';

export class AllApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.ALL;
}

export class ProjectsAndProductsApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.PROJECTS_AND_PRODUCTS;
}

export class DataApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.DATA;
}

export class ArticlesApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.ARTICLES;
}

export class BooksApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.BOOKS;
}

export class DissertationsApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.DISSERTATIONS;
}

export class ProjectsApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.PROJECTS;
}

export class ResearchersApi extends BaseApi {
  protected endpoint = SEARCH_TYPES.RESEARCHERS;
}

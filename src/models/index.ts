export interface CiniiApiResponse<T = CiniiItem> {
  '@context': Record<string, unknown>;
  '@id': string;
  '@type': 'channel';
  title: string;
  description?: string;
  link?: { '@id': string };
  'dc:date'?: string;
  'opensearch:totalResults': string;
  'opensearch:startIndex'?: string;
  'opensearch:itemsPerPage'?: string;
  items: T[];
}

export interface CiniiItem {
  '@id'?: string;
  '@type'?: string;
  title?: string;
  link?: { '@id': string };
  'rdfs:seeAlso'?: { '@id': string };
  'dc:creator': string[];
  'dc:publisher'?: string;
  'dc:type': string;
  'prism:publicationName'?: string;
  'prism:issn'?: string;
  'prism:volume'?: string;
  'prism:number'?: string;
  'prism:startingPage'?: string;
  'prism:endingPage'?: string;
  'prism:pageRange'?: string;
  'prism:publicationDate'?: string;
  description?: string;
  abstractLicenseFlag?: 'allow' | 'disallow';
  'dc:identifier'?: Array<{ '@type': string; '@value': string }>;
  'dc:subject'?: string[];
  'ndl:degreeName'?: string;
  'ndl:dissertationNumber'?: string;
  'dc:date'?: string;
  'dc:source'?: Array<{ '@id'?: string; 'dc:title'?: string }>;
}

export interface CiniiApiClientOptions {
  appId: string;
  timeout?: number;
  maxRetries?: number;
  useCache?: boolean;
  cacheDir?: string;
}

export interface CiniiSearchParams {
  appid?: string;
  format?: 'json' | 'html' | 'rss' | 'atom';
  lang?: 'ja' | 'en';
  count?: number;
  sortorder?: number;
  from?: string;
  until?: string;
  projectYearFrom?: string;
  projectYearUntil?: string;
  productYearFrom?: string;
  productYearUntil?: string;
  datasetFormat?: string;
  hasLinkToFullText?: boolean;
  title?: string;
  isFullTitle?: boolean;
  creator?: string; // 著者ID (researcherId)
  researcherId?: string; // 著者ID
  affiliation?: string;
  publicationTitle?: string;
  issn?: string;
  volume?: string;
  number?: string;
  pages?: string;
  isbn?: string;
  ncid?: string;
  category?: string;
  description?: string;
  awardInstitution?: string;
  degree?: string;
  awardYear?: string;
  publisher?: string;
  projectId?: string;
  doi?: string;
  dataSourceType?: string;
  languageType?: string;
  resourceType?: string;
  rdProgramType?: string;
  institution?: string;
  department?: string;
  jobTitle?: string;
  numberOfResearchProducts?: string;
  numberOfResearchProjects?: string;
  keyword?: string;
  // その他のパラメータ用インデックスシグネチャ
  [key: string]: string | number | boolean | undefined;
}

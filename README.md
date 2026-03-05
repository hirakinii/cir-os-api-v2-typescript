# cinii-research-opensearch-api-client

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A TypeScript / Node.js client library to communicate with the OpenResearch API (CiR-OS API) provided by CiNii Research (CiR), allowing you to search and retrieve a wide range of academic information such as articles, research data, books, dissertations, projects, and researchers.

## Features

- **Full TypeScript Support**: Built-in type definitions allow you to handle API responses safely.
- **Supports Various Search Endpoints**: Supports endpoints for articles, books, research data (data), dissertations, projects, researchers, and all.
- **Built-in Caching**: Includes a local caching feature for API responses by default to reduce the load on the API server and speed up requests (can be enabled/disabled).

## Installation

```bash
npm install cinii-research-opensearch-api-client
```

## Requirements

- Node.js v18 or later recommended

## Usage

To use this library, you need an application ID (`appId`) for the CiNii API. Please obtain one in advance.

```typescript
import { CiniiApiClient } from 'cinii-research-opensearch-api-client';

async function main() {
  // Set your application ID
  // It is recommended to obtain this from environment variables (e.g., process.env.CINII_APP_ID).
  const appId = process.env.CINII_APP_ID || 'YOUR_APP_ID_HERE';

  // Instantiate the client
  // You can specify options to enable/disable caching, set the cache directory, etc.
  const client = new CiniiApiClient({
    appId,
    useCache: true, // Enabled by default
  });

  try {
    console.log('=== Searching for Articles ===');
    // Example: Search for articles related to "Machine Learning", retrieve 5 items
    const articlesResponse = await client.articles.search({
      title: 'Machine Learning', // "機械学習"
      count: 5,
    });

    console.log(`Hits: ${articlesResponse['opensearch:totalResults']} items`);
    articlesResponse.items.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.title}`);
      console.log(`    Authors: ${item['dc:creator']?.join(', ') || 'Unknown'}`);
      console.log(`    URI: ${item['@id']}`);
    });

    console.log('\n=== Searching for Researchers ===');
    // Example: Search for researchers related to a specific keyword
    const researchersResponse = await client.researchers.search({
      keyword: 'Natural Language Processing', // "自然言語処理"
      count: 3,
    });

    console.log(`Hits: ${researchersResponse['opensearch:totalResults']} items`);
    researchersResponse.items.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.title}`);
    });
  } catch (error) {
    console.error('An error occurred during the API request:', error);
  }
}

main();
```

## About the Cache Feature

By default, caches are saved in `~/.cinii_api_cache`. If a request with the same parameters exists in the cache, the client returns the cached result without making a new network request.
You can customize the cache behavior in the `CiniiApiClient` constructor.

```typescript
const client = new CiniiApiClient({
  appId: 'YOUR_APP_ID',
  useCache: true, 
  cacheDir: './custom_cache_dir' // Change the cache directory
});
```

## License

[Apache-2.0](LICENSE)

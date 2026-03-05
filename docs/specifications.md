# CiNii Research OpenSearch API Client for TypeScript 仕様書

## 1. 概要

本ライブラリは、CiNii Research（CiR）が提供する OpenResearch API（以下、CiR-OS API と呼びます）と通信し、論文、研究データ、書籍、博士論文、プロジェクト、研究者などの幅広い学術情報を検索・取得するための TypeScript/Node.js 向けクライアントライブラリです。

## 2. システム要件

* **動作環境**: Node.js (v18以降を推奨)
* **主要言語**: TypeScript
* **想定される外部パッケージ**:
    * HTTPクライアント: `axios` またはネイティブ `fetch`
    * ※ CiNii Research API は標準で JSON (JSON-LD) フォーマットをサポートするため、XMLパーサーは必須ではありません。

## 3. ディレクトリ・モジュール構成案

エンドポイントの「検索種別」ごとにAPI呼び出しを整理した構成とします。

```text
src/
 ├── index.ts           # エントリポイント (export CiniiApiClient 等)
 ├── client.ts          # CiniiApiClient クラス
 ├── api/
 │    ├── index.ts
 │    ├── articles.ts   # 論文 (articles) 検索API
 │    ├── books.ts      # 書籍 (books) 検索API
 │    ├── data.ts       # 研究データ (data) 検索API
 │    ├── dissertations.ts # 博士論文 (dissertations) 検索API
 │    ├── projects.ts   # プロジェクト (projects) 検索API
 │    ├── researchers.ts# 研究者 (researchers) 検索API
 │    └── all.ts        # すべて (all) 検索API
 ├── models/
 │    └── index.ts      # 型定義・インターフェース
 ├── cache.ts           # キャッシュ管理クラス
 ├── constants.ts       # APIエンドポイントやデフォルト値などの定数
 ├── exceptions.ts      # カスタムエラークラス
 └── utils.ts           # URL構築等のユーティリティ関数

```

## 4. 主要インターフェース（型定義）

`src/models/index.ts` にて定義する、API レスポンスに基づく主要な型です。

### 4.1. 共通レスポンス型

CiR-OS API が返す JSON-LD 形式のルートレスポンス定義です。

```typescript
export interface CiniiApiResponse<T = CiniiItem> {
  "@context": any;
  "@id": string;          // リクエストのURI
  "@type": "channel";     // 固定値: channel
  title: string;          // 検索タイトル
  description?: string;   
  link?: { "@id": string };
  "dc:date"?: string;     // 検索が行われた日時
  "opensearch:totalResults": string; // 検索結果総数
  "opensearch:startIndex"?: string;  // 開始番号
  "opensearch:itemsPerPage"?: string;// レスポンスに含まれる件数
  items: T[];             // 検索結果の配列
}

```

### 4.2. 検索結果アイテム (Items) の型

各検索結果の要素を表す型です。

```typescript
export interface CiniiItem {
  "@id"?: string;                   // 詳細ページのURI
  "@type"?: string;
  title?: string;                   // 著者名またはタイトル
  link?: { "@id": string };
  "rdfs:seeAlso"?: { "@id": string }; // JSON-LDのURI
  "dc:creator": string[];           // 著者名
  "dc:publisher"?: string;          // 出版者・学位授与機関名
  "dc:type": string;                // データ種別
  "prism:publicationName"?: string; // 刊行物名
  "prism:issn"?: string;            // ISSN
  "prism:volume"?: string;          // 巻
  "prism:number"?: string;          // 号
  "prism:startingPage"?: string;    // 開始ページ
  "prism:endingPage"?: string;      // 終了ページ
  "prism:publicationDate"?: string; // 出版年月日
  description?: string;             // 抄録
  abstractLicenseFlag?: "allow" | "disallow"; // 抄録ライセンス
  "dc:identifier"?: Array<{ "@type": string; "@value": string }>; // 識別子
  "dc:subject"?: string[];          // キーワード
  "ndl:degreeName"?: string;        // 取得学位名
  "ndl:dissertationNumber"?: string;// 学位授与番号
  "dc:source"?: Array<{ "@id": string; "dc:title": string }>; // 本文公開ページ情報等
}

```

## 5. API クライアント仕様

### 5.1. CiniiApiClient クラス (`src/client.ts`)

メインとなるクライアントクラスです。

* **コンストラクタ引数**
```typescript
export interface CiniiApiClientOptions {
  appId: string;        // CiNii API アプリケーションID (必須)
  timeout?: number;     // タイムアウト時間 (ms) default: 30000
  maxRetries?: number;  // 最大リトライ回数 default: 3
  useCache?: boolean;   // キャッシュを使用するか default: true
  cacheDir?: string;    // キャッシュ保存ディレクトリ default: ~/.cinii_api_cache
}

```

* **プロパティ**: `articles`, `books`, `data`, `projects` などの各エンドポイントに対応するAPIアクセスクラス群を保持します。

### 5.2. 検索パラメータ型 (`CiniiSearchParams`)

すべての検索エンドポイントで共通またはオプショナルとして使用されるクエリパラメータです。対象エンドポイント（availableIn）によって利用可能なパラメータは制限されます。

```typescript
export interface CiniiSearchParams {
  format?: "json" | "html" | "rss" | "atom"; // 出力フォーマット
  lang?: "ja" | "en";               // 結果言語
  count?: number;                   // ページ当たり表示件数 (1-200)
  sortorder?: number;               // ソート順 (0, 1, 4, 5, 6, 10, 20, 30, 40)
  title?: string;                   // タイトル/研究課題名
  hasLinkToFullText?: boolean;      // 本文あり検索フラグ
  from?: string;                    // 開始年 (YYYY/YYYYMM)
  until?: string;                   // 終了年 (YYYY/YYYYMM)
  creator?: string;                 // 著者ID (researcherId)
  affiliation?: string;             // 所属機関
  issn?: string;                    // ISSN
  doi?: string;                     // DOI
  dataSourceType?: string;          // データソース種別 (JALC, IRDB等)
  // その他、検索種別特有のパラメータ (resourceType, projectYearFrom, isbn など)
}

```

### 5.3. エンドポイント別サービスクラス群

例として、論文 (articles) を検索するためのクラスです。

* **メソッド**: `search(params: CiniiSearchParams): Promise<CiniiApiResponse>`
* **実装要件**:
    * ベースURL `https://cir.nii.ac.jp/opensearch/v2/articles` に対して GET リクエストを行う。
    * 必須パラメータ `appid` を自動付与し、指定されたパラメータをURLクエリにシリアライズする。

## 6. キャッシュ機能 (`src/cache.ts`)

APIサーバーへの負荷軽減と高速化のためのレスポンスキャッシュ機能です。

* **初期化**: キャッシュディレクトリ（デフォルト: `~/.cinii_api_cache`）を設定。
* URLのハッシュ値をファイル名として管理し、`get`、`set`、`clear` メソッドを提供します。

## 7. 例外処理・エラー (`src/exceptions.ts`)

カスタムエラークラスを定義し、エラーハンドリングを明確にします。

* `CiniiApiError`: 基底クラス
* `CiniiApiRequestError`: ネットワークエラーやリクエスト構築失敗
* `CiniiApiResponseError`: JSONパース失敗などのレスポンス処理時エラー

## 8. 定数 (`src/constants.ts`)

エンドポイントやデフォルト値を定義します。

```typescript
export const ENDPOINTS = {
  BASE_URL: "https://cir.nii.ac.jp/opensearch/v2/"
};

export const SEARCH_TYPES = {
  ALL: "all",
  PROJECTS_AND_PRODUCTS: "projectsAndProducts",
  DATA: "data",
  ARTICLES: "articles",
  BOOKS: "books",
  DISSERTATIONS: "dissertations",
  PROJECTS: "projects",
  RESEARCHERS: "researchers"
}; //

export const DEFAULTS = {
  FORMAT: "json", //
  LANG: "ja",     //
  COUNT: 20       //
};

```

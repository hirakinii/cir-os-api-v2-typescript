# Implementation Plan: CiNii Research OpenSearch API Client

## Overview

本計画は、CiNii Research OpenSearch APIと通信するためのTypeScript/Node.js向けクライアントライブラリの実装手順を定めたものです。各種学術情報（論文、書籍、研究データ等）の検索・取得機能、レスポンスキャッシュ機能、及びカスタムエラーハンドリングを提供します。

## Requirements for development

**必ず Test-Driven Development を実施します。**

## Requirements

- JSON-LDのAPIレスポンスおよび検索パラメータに対応するTypeScriptの型定義（インターフェース）の実装
- 各検索種別（all, articles, books, data, dissertations, projects, researchers）に対応したAPIサービスクラス群の実装
- APIサーバの負荷軽減と高速化のためのファイルベースのキャッシュ機能の実装
- ネットワークやレスポンス処理時のエラーを明示的に扱うカスタムエラークラスの実装
- 必須パラメータ（appid）の自動付与やURL構築のためのユーティリティの実装

## Architecture Changes

- `src/models/index.ts`: APIのリクエスト・レスポンスおよびオプションの型定義
- `src/constants.ts`: APIエンドポイントURL、検索種別、デフォルト値などの定数管理
- `src/exceptions.ts`: カスタムエラークラス（`CiniiApiError` など）の定義
- `src/utils.ts`: URLのクエリパラメータ構築、ハッシュ生成（キャッシュキー用）などの汎用関数群
- `src/cache.ts`: キャッシュの保存・取得・削除を担うクラス（デフォルト `~/.cinii_api_cache`）
- `src/api/base.ts` (新規提案): APIコールの共通処理（fetch/axios、リトライ機構、エラーハンドリング）を担う基底クラス
- `src/api/*.ts`: 各エンドポイントに特化したクラス (`articles.ts`, `books.ts` 等)
- `src/client.ts`: エンドポイントクラス群を統合するメインクライアント (`CiniiApiClient`)
- `src/index.ts`: ライブラリのエントリポイント（型やメインクラスのexport）

## Implementation Steps

### Phase 1: Models, Constants, and Exceptions

1. **型定義の作成** (File: `src/models/index.ts`)
   - Action: `docs/specifications.md` および `src/schema/*.json` に基づき、`CiniiApiResponse`, `CiniiItem`, `CiniiSearchParams`, `CiniiApiClientOptions` のインターフェースを定義する。
   - Why: ライブラリ全体の型安全性を確保するため。
   - Dependencies: なし
   - Risk: Low

2. **定数の定義** (File: `src/constants.ts`)
   - Action: `ENDPOINTS.BASE_URL`, `SEARCH_TYPES`, `DEFAULTS` を定義する。
   - Why: エンドポイントやデフォルト値をコード内でハードコードせず一元管理するため。
   - Dependencies: なし
   - Risk: Low

3. **カスタム例外の作成** (File: `src/exceptions.ts`)
   - Action: 基底エラー `CiniiApiError`、ネットワーク系エラー `CiniiApiRequestError`、レスポンス系エラー `CiniiApiResponseError` を定義する。
   - Why: 利用者がエラーの原因（リクエスト失敗か、パース失敗か等）をハンドリングしやすくするため。
   - Dependencies: なし
   - Risk: Low

### Phase 2: Core Utilities and Caching

4. **ユーティリティ関数の実装** (File: `src/utils.ts`)
   - Action: 検索パラメータオブジェクトからURLクエリ文字列への変換関数、URLからキャッシュ用のハッシュ（SHA-256など）を生成する関数を実装する。
   - Why: 各APIクラスやキャッシュクラスでの重複処理を避けるため。
   - Dependencies: `src/models/index.ts`
   - Risk: Low

5. **キャッシュ管理の実装** (File: `src/cache.ts`)
   - Action: 指定ディレクトリにハッシュ値のファイル名でJSONを保存・取得・クリアする `CacheManager` クラスを実装する。
   - Why: 要件にあるサーバ負荷軽減とAPI応答の高速化を実現するため。
   - Dependencies: `src/utils.ts`, Node.jsの `fs/promises` または同等のモジュール
   - Risk: Medium (ファイルシステムへのアクセス権限がない場合のフォールバックが必要)

### Phase 3: API Endpoint Services

6. **基底APIクラスの実装** (File: `src/api/base.ts`)
   - Action: `appId` の自動付与、リトライ処理、`CacheManager` との連携、通信エラー時の `CiniiApiRequestError` スローなどの共通機能を持つ抽象クラスを実装する。
   - Why: エンドポイントごとの実装コードを最小限に抑え、DRY原則を維持するため。
   - Dependencies: `src/utils.ts`, `src/cache.ts`, `src/exceptions.ts`
   - Risk: Medium

7. **各エンドポイントAPIクラスの実装** (Files: `src/api/articles.ts`, `src/api/books.ts` 他)
   - Action: `base.ts` を継承し、それぞれ固有のパス (`articles`, `books`, `data` など) を設定したクラスを実装する。
   - Why: 仕様書のディレクトリ構成に基づき、エンドポイントごとにメソッドを整理するため。
   - Dependencies: `src/api/base.ts`
   - Risk: Low

8. **APIモジュールのエクスポート** (File: `src/api/index.ts`)
   - Action: 作成したすべてのAPIクラスをエクスポートする。
   - Why: メインクライアントからのインポートを簡素化するため。
   - Dependencies: `src/api/*.ts`
   - Risk: Low

### Phase 4: Main Client and Public API

9. **メインクライアントクラスの実装** (File: `src/client.ts`)
   - Action: コンストラクタで `CiniiApiClientOptions` を受け取り、`CacheManager` の初期化と各APIエンドポイントクラスのインスタンス化（`this.articles = new ArticlesApi(...)` 等）を行う `CiniiApiClient` クラスを実装する。
   - Why: ユーザーがライブラリを利用する際のエントリポイントとなるため。
   - Dependencies: `src/api/index.ts`, `src/cache.ts`, `src/models/index.ts`
   - Risk: Low

10. **外部向けAPIの公開** (File: `src/index.ts`)
    - Action: `CiniiApiClient`、カスタムエラークラス、必要な型定義 (models) をエクスポートする。
    - Why: パッケージの利用者が直感的に必要なモジュールをインポートできるようにするため。
    - Dependencies: `src/client.ts`, `src/models/index.ts`, `src/exceptions.ts`
    - Risk: Low

## Testing Strategy

- Unit tests:
  - `src/utils.ts`: クエリシリアライズやハッシュ生成が正しく行われるかテスト。
  - `src/cache.ts`: 一時ディレクトリを用いてファイルI/Oおよびキャッシュのヒット・ミス挙動をテスト。
  - `src/api/base.ts`: axios/fetchをモック化し、リクエストパラメータの付与やエラーの送出が正しく動くかテスト。
- Integration tests:
  - `src/client.ts`: クライアント生成時に各APIの初期化が正しく行われ、メソッド呼び出しが正しいURLへのアクセスへとつながるかをテスト。
- E2E tests:
  - 実際のCiR-OS APIのエンドポイント（安全なクエリ）を用いて、JSONレスポンスのパースと型安全性が担保できているか検証。

## Risks & Mitigations

- **Risk**: キャッシュディレクトリ（デフォルト `~/.cinii_api_cache`）の作成や書き込みで権限エラー（EACCES等）が発生する。
  - Mitigation: `try...catch` でラップし、失敗時は警告をログに出力した上で、以降の処理はキャッシュバイパス（`useCache = false` 相当）で継続するようにする。
- **Risk**: API のレート制限や一時的なネットワーク切断による検索失敗。
  - Mitigation: 指数バックオフ（Exponential Backoff）を用いたリトライ機構を `BaseApi` に持たせ、堅牢性を高める。
- **Risk**: CiR-OS のレスポンススキーマが将来的に変更され、パースエラーが起きる。
  - Mitigation: 必須プロパティとオプショナルプロパティを型定義で明確にし、未定義キーに対する安全なアクセスを行う。

## Success Criteria

- [x] 提供されたJSONスキーマに基づく、過不足のない型定義が用意されている。
- [x] `CiniiApiClient` をインスタンス化し、全7種のエンドポイントに対して検索を実行できる。
- [x] 検索時に必須となる `appid` パラメータが透過的かつ自動的に付与される。
- [x] HTTPレスポンスが正しく `CiniiApiResponse` 型のオブジェクトに変換される。
- [x] 同一の検索リクエストを再度実行した際、キャッシュファイルからデータがロードされる。
- [x] 通信エラーや不正なフォーマットを受け取った際、適切なカスタム例外がスローされる。

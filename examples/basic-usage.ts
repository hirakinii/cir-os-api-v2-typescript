import { CiniiApiClient } from '../src/index.js';

async function main() {
  // アプリケーションIDを設定してください (取得方法はCiNii APIの公式サイトを参照)
  // 本来は環境変数(process.env.CINII_APP_ID等)から取得することを推奨します。
  const appId = process.env.CINII_APP_ID || 'YOUR_APP_ID_HERE';

  // クライアントのインスタンス化
  // options でキャッシュの有効/無効、ディレクトリなどを指定可能です
  const client = new CiniiApiClient({
    appId,
    useCache: true, // デフォルトで有効
  });

  try {
    console.log('=== 論文 (Articles) の検索 ===');
    // 例: 「機械学習」に関する論文を検索、5件取得
    const articlesResponse = await client.articles.search({
      title: '機械学習',
      count: 5,
    });

    console.log(`ヒット件数: ${articlesResponse['opensearch:totalResults']} 件`);
    articlesResponse.items.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.title}`);
      console.log(`    著者: ${item['dc:creator']?.join(', ') || '不明'}`);
      console.log(`    URI: ${item['@id']}`);
    });

    console.log('\n=== 研究者 (Researchers) の検索 ===');
    // 例: 特定のキーワードに関連する研究者を検索
    const researchersResponse = await client.researchers.search({
      keyword: '自然言語処理',
      count: 3,
    });

    console.log(`ヒット件数: ${researchersResponse['opensearch:totalResults']} 件`);
    researchersResponse.items.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.title}`);
    });
  } catch (error) {
    console.error('APIリクエスト中にエラーが発生しました:', error);
  }
}

main();

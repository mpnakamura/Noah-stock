# AI Mindmap Generator - セットアップガイド

## 前提条件

- Node.js 18.17以降
- npm または yarn
- Anthropic API Key

## 1. Anthropic API Keyの取得

1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. アカウント作成 or ログイン
3. API Keysページで新しいキーを作成
4. キーをコピー（後で使用します）

## 2. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd Noah-stock

# 依存関係のインストール
npm install
```

## 3. 環境変数の設定

```bash
# .env.localファイルを作成
cp .env.example .env.local
```

`.env.local`ファイルを開き、APIキーを設定：

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

⚠️ **重要**: `.env.local`はGitにコミットされません（`.gitignore`に含まれています）

## 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 5. 動作確認

1. 左側の入力フォームに要件を入力
   - 例: "プロダクトマネージャーに必要なスキル体系"
2. 「マインドマップを生成」ボタンをクリック
3. 右側にマインドマップが表示されることを確認
4. エクスポートボタン（JSON、PNG）の動作を確認

## 6. プロダクションビルド

```bash
# ビルド
npm run build

# プロダクションサーバーの起動
npm start
```

## トラブルシューティング

### エラー: "ANTHROPIC_API_KEY is not configured"

**原因**: 環境変数が正しく設定されていない

**解決策**:
1. `.env.local`ファイルが存在するか確認
2. `ANTHROPIC_API_KEY=`の後に実際のAPIキーが設定されているか確認
3. 開発サーバーを再起動

### エラー: "Failed to generate mindmap"

**原因**: APIリクエストの失敗

**解決策**:
1. APIキーが有効か確認
2. Anthropicのアカウントにクレジットがあるか確認
3. ネットワーク接続を確認
4. ブラウザのコンソールでエラーメッセージを確認

### ビルドエラー

**解決策**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install

# キャッシュをクリア
rm -rf .next
npm run build
```

## Vercelへのデプロイ

### 1. Vercelアカウントの準備

1. [Vercel](https://vercel.com)でアカウント作成
2. GitHubと連携

### 2. プロジェクトのインポート

```bash
# Vercel CLIのインストール（オプション）
npm i -g vercel

# デプロイ
vercel
```

または、Vercel Dashboardから：
1. "New Project"をクリック
2. GitHubリポジトリを選択
3. 環境変数を設定：
   - `ANTHROPIC_API_KEY`: あなたのAPIキー
4. "Deploy"をクリック

### 3. 環境変数の設定

Vercel Dashboard > Settings > Environment Variables で設定：

- **Key**: `ANTHROPIC_API_KEY`
- **Value**: あなたのAnthropicAPIキー
- **Environment**: Production, Preview, Development

## 開発Tips

### ホットリロード

ファイルを編集すると自動的にブラウザがリロードされます。

### TypeScript

型チェックを実行：
```bash
npx tsc --noEmit
```

### リント

```bash
npm run lint
```

### デバッグ

ブラウザのDevToolsコンソールでログを確認：
- クライアントサイド: ブラウザコンソール
- サーバーサイド: ターミナル（npm run dev実行中）

## 次のステップ

1. [PRODUCT_SPEC.md](./PRODUCT_SPEC.md)でプロダクト仕様を確認
2. カスタマイズやエンハンスメントを追加
3. フィードバックやバグレポートを提出

## サポート

問題が発生した場合:
1. GitHubのIssuesで質問
2. ドキュメントを確認
3. コミュニティに参加

Happy Coding! 🎉

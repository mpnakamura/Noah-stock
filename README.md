# AI Mindmap Generator

AIが自動的にマインドマップを生成するNext.jsアプリケーション

## プロダクト概要

ユーザーが要件やアイデアを自然言語で入力すると、AIが階層的なマインドマップを自動生成し、インタラクティブに視覚化するツールです。PM、エンジニア、デザイナーなど、様々な職種の方が使えるプロダクトです。

## 主な機能

- 📝 **要件入力**: 自由記述で要件やアイデアを入力
- 🤖 **AI自動生成**: 入力内容から階層的なマインドマップを自動生成
- 🎨 **インタラクティブ可視化**: ズーム、パン、ノードの展開/折りたたみ
- 💾 **エクスポート**: JSON、PNG形式での保存

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: React Flow
- **AI**: Anthropic Claude API

## セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
# .env.localにANTHROPIC_API_KEYを設定

# 開発サーバーの起動
npm run dev
```

## 使い方

1. アプリケーションを起動
2. 要件やアイデアをテキストエリアに入力
3. 「マインドマップを生成」ボタンをクリック
4. AIが自動生成したマインドマップを確認
5. 必要に応じてエクスポート

## プロダクトロードマップ

### Phase 1: MVP (Current)
- [x] プロジェクトセットアップ
- [ ] 基本的なUI実装
- [ ] AI統合
- [ ] エクスポート機能

### Phase 2: Enhancement
- [ ] マインドマップの手動編集機能
- [ ] テンプレート機能
- [ ] 保存・履歴機能

### Phase 3: Collaboration
- [ ] マルチユーザー対応
- [ ] リアルタイム共同編集
- [ ] コメント機能

## ライセンス

MIT

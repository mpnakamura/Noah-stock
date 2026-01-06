import { Template } from "@/types/mindmap";

export const templates: Template[] = [
  {
    id: "pm-skills",
    name: "PMスキルマップ",
    description: "プロダクトマネージャーに必要な包括的なスキル体系",
    category: "ビジネス",
    icon: "🎯",
    data: {
      root: {
        id: "root",
        label: "PMスキル",
        children: [
          {
            id: "technical",
            label: "テクニカルスキル",
            children: [
              { id: "tech-1", label: "API設計", children: [] },
              { id: "tech-2", label: "データベース", children: [] },
              { id: "tech-3", label: "クラウド", children: [] },
              { id: "tech-4", label: "CI/CD", children: [] },
            ],
          },
          {
            id: "design",
            label: "デザイン・UX",
            children: [
              { id: "design-1", label: "ユーザーリサーチ", children: [] },
              { id: "design-2", label: "プロトタイピング", children: [] },
              { id: "design-3", label: "A/Bテスト", children: [] },
              { id: "design-4", label: "アクセシビリティ", children: [] },
            ],
          },
          {
            id: "data",
            label: "データ分析",
            children: [
              { id: "data-1", label: "SQL", children: [] },
              { id: "data-2", label: "KPI設定", children: [] },
              { id: "data-3", label: "データビジュアライゼーション", children: [] },
              { id: "data-4", label: "統計学", children: [] },
            ],
          },
          {
            id: "soft",
            label: "ソフトスキル",
            children: [
              { id: "soft-1", label: "コミュニケーション", children: [] },
              { id: "soft-2", label: "リーダーシップ", children: [] },
              { id: "soft-3", label: "ネゴシエーション", children: [] },
              { id: "soft-4", label: "コンフリクト解消", children: [] },
            ],
          },
          {
            id: "product",
            label: "プロダクトマネジメント",
            children: [
              { id: "product-1", label: "プロダクトビジョン", children: [] },
              { id: "product-2", label: "ロードマップ作成", children: [] },
              { id: "product-3", label: "バックログ管理", children: [] },
              { id: "product-4", label: "OKR設定", children: [] },
            ],
          },
          {
            id: "business",
            label: "ビジネススキル",
            children: [
              { id: "business-1", label: "市場調査", children: [] },
              { id: "business-2", label: "競合分析", children: [] },
              { id: "business-3", label: "財務知識", children: [] },
              { id: "business-4", label: "戦略的思考", children: [] },
            ],
          },
        ],
      },
    },
  },
  {
    id: "project-plan",
    name: "プロジェクト計画",
    description: "プロジェクト管理の基本的なフレームワーク",
    category: "プロジェクト",
    icon: "📋",
    data: {
      root: {
        id: "root",
        label: "プロジェクト計画",
        children: [
          {
            id: "initiation",
            label: "立ち上げ",
            children: [
              { id: "init-1", label: "プロジェクト憲章", children: [] },
              { id: "init-2", label: "ステークホルダー特定", children: [] },
              { id: "init-3", label: "目標設定", children: [] },
            ],
          },
          {
            id: "planning",
            label: "計画",
            children: [
              { id: "plan-1", label: "スコープ定義", children: [] },
              { id: "plan-2", label: "スケジュール作成", children: [] },
              { id: "plan-3", label: "予算策定", children: [] },
              { id: "plan-4", label: "リスク分析", children: [] },
            ],
          },
          {
            id: "execution",
            label: "実行",
            children: [
              { id: "exec-1", label: "チーム編成", children: [] },
              { id: "exec-2", label: "タスク割り当て", children: [] },
              { id: "exec-3", label: "進捗管理", children: [] },
              { id: "exec-4", label: "品質管理", children: [] },
            ],
          },
          {
            id: "monitoring",
            label: "監視・コントロール",
            children: [
              { id: "mon-1", label: "進捗レポート", children: [] },
              { id: "mon-2", label: "変更管理", children: [] },
              { id: "mon-3", label: "リスク対応", children: [] },
            ],
          },
          {
            id: "closure",
            label: "終結",
            children: [
              { id: "close-1", label: "成果物納品", children: [] },
              { id: "close-2", label: "振り返り", children: [] },
              { id: "close-3", label: "ドキュメント作成", children: [] },
            ],
          },
        ],
      },
    },
  },
  {
    id: "tech-stack",
    name: "技術スタック",
    description: "現代的なWebアプリケーションの技術構成",
    category: "技術",
    icon: "💻",
    data: {
      root: {
        id: "root",
        label: "技術スタック",
        children: [
          {
            id: "frontend",
            label: "フロントエンド",
            children: [
              { id: "fe-1", label: "React/Next.js", children: [] },
              { id: "fe-2", label: "TypeScript", children: [] },
              { id: "fe-3", label: "Tailwind CSS", children: [] },
              { id: "fe-4", label: "State管理", children: [] },
            ],
          },
          {
            id: "backend",
            label: "バックエンド",
            children: [
              { id: "be-1", label: "Node.js/Express", children: [] },
              { id: "be-2", label: "API設計", children: [] },
              { id: "be-3", label: "認証・認可", children: [] },
              { id: "be-4", label: "バリデーション", children: [] },
            ],
          },
          {
            id: "database",
            label: "データベース",
            children: [
              { id: "db-1", label: "PostgreSQL", children: [] },
              { id: "db-2", label: "Redis", children: [] },
              { id: "db-3", label: "ORM/Prisma", children: [] },
            ],
          },
          {
            id: "infrastructure",
            label: "インフラ",
            children: [
              { id: "infra-1", label: "Vercel/AWS", children: [] },
              { id: "infra-2", label: "Docker", children: [] },
              { id: "infra-3", label: "CI/CD", children: [] },
              { id: "infra-4", label: "モニタリング", children: [] },
            ],
          },
          {
            id: "tools",
            label: "開発ツール",
            children: [
              { id: "tool-1", label: "Git/GitHub", children: [] },
              { id: "tool-2", label: "ESLint/Prettier", children: [] },
              { id: "tool-3", label: "Testing", children: [] },
            ],
          },
        ],
      },
    },
  },
  {
    id: "ai-product",
    name: "AI プロダクト開発",
    description: "AI機能を持つプロダクトの開発プロセス",
    category: "AI",
    icon: "🤖",
    data: {
      root: {
        id: "root",
        label: "AI プロダクト",
        children: [
          {
            id: "strategy",
            label: "戦略",
            children: [
              { id: "strat-1", label: "ユースケース定義", children: [] },
              { id: "strat-2", label: "データ戦略", children: [] },
              { id: "strat-3", label: "倫理・ガバナンス", children: [] },
            ],
          },
          {
            id: "ai-tech",
            label: "AI技術",
            children: [
              { id: "ai-1", label: "LLM統合", children: [] },
              { id: "ai-2", label: "プロンプトエンジニアリング", children: [] },
              { id: "ai-3", label: "RAG", children: [] },
              { id: "ai-4", label: "ファインチューニング", children: [] },
            ],
          },
          {
            id: "development",
            label: "開発",
            children: [
              { id: "dev-1", label: "API統合", children: [] },
              { id: "dev-2", label: "エラーハンドリング", children: [] },
              { id: "dev-3", label: "レート制限", children: [] },
            ],
          },
          {
            id: "evaluation",
            label: "評価・改善",
            children: [
              { id: "eval-1", label: "品質評価", children: [] },
              { id: "eval-2", label: "ユーザーフィードバック", children: [] },
              { id: "eval-3", label: "コスト最適化", children: [] },
            ],
          },
        ],
      },
    },
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter((t) => t.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(templates.map((t) => t.category)));
};

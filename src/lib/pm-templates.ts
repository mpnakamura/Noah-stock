import { Template } from "@/types/mindmap";

export const pmTemplates: Template[] = [
  {
    id: "feature-planning",
    name: "新機能開発計画",
    description: "機能要件からタスク分解、優先順位付けまで",
    category: "開発",
    icon: "🎯",
    data: {
      root: {
        id: "root",
        label: "新機能開発",
        children: [
          {
            id: "scope-in",
            label: "✅ やること（Scope In）",
            children: [
              {
                id: "mvp",
                label: "MVP（最小限）",
                children: [
                  { id: "mvp-1", label: "コア機能A", children: [] },
                  { id: "mvp-2", label: "基本UI", children: [] },
                  { id: "mvp-3", label: "必須API", children: [] },
                ],
              },
              {
                id: "phase1",
                label: "Phase 1（初期リリース）",
                children: [
                  { id: "p1-1", label: "基本機能B", children: [] },
                  { id: "p1-2", label: "エラーハンドリング", children: [] },
                ],
              },
            ],
          },
          {
            id: "scope-out",
            label: "❌ やらないこと（Scope Out）",
            children: [
              { id: "out-1", label: "高度なカスタマイズ → Phase 2へ", children: [] },
              { id: "out-2", label: "多言語対応 → 需要確認後", children: [] },
              { id: "out-3", label: "レポート機能 → 優先度低", children: [] },
            ],
          },
          {
            id: "risks",
            label: "⚠️ リスク・課題",
            children: [
              {
                id: "tech-risk",
                label: "技術リスク",
                children: [
                  { id: "risk-1", label: "外部API依存（対策：Fallback実装）", children: [] },
                  { id: "risk-2", label: "パフォーマンス懸念（対策：負荷テスト）", children: [] },
                ],
              },
              {
                id: "schedule-risk",
                label: "スケジュールリスク",
                children: [
                  { id: "risk-3", label: "他チーム依存（対策：早期調整）", children: [] },
                ],
              },
            ],
          },
          {
            id: "tradeoffs",
            label: "🔄 トレードオフ",
            children: [
              { id: "to-1", label: "速度 vs 品質：MVPは速度優先", children: [] },
              { id: "to-2", label: "柔軟性 vs シンプル：シンプル優先", children: [] },
            ],
          },
        ],
      },
    },
  },
  {
    id: "mvp-planning",
    name: "MVP計画",
    description: "最小限のプロダクトを定義し、段階的リリース計画",
    category: "戦略",
    icon: "🚀",
    data: {
      root: {
        id: "root",
        label: "MVP計画",
        children: [
          {
            id: "mvp-core",
            label: "✅ MVPコア（必須）",
            children: [
              { id: "core-1", label: "ユーザー登録・ログイン", children: [] },
              { id: "core-2", label: "基本CRUD機能", children: [] },
              { id: "core-3", label: "最小限のUI", children: [] },
            ],
          },
          {
            id: "mvp-defer",
            label: "⏸️ MVP後回し",
            children: [
              { id: "defer-1", label: "通知機能 → Phase 2", children: [] },
              { id: "defer-2", label: "詳細検索 → Phase 2", children: [] },
              { id: "defer-3", label: "エクスポート → Phase 3", children: [] },
            ],
          },
          {
            id: "mvp-never",
            label: "❌ やらない（Scope外）",
            children: [
              { id: "never-1", label: "SNS連携 → 需要不明", children: [] },
              { id: "never-2", label: "AI推薦 → コスト高", children: [] },
            ],
          },
          {
            id: "validation",
            label: "📊 検証項目",
            children: [
              { id: "val-1", label: "仮説：ユーザーはシンプルさを求める", children: [] },
              { id: "val-2", label: "指標：週次アクティブ率 > 40%", children: [] },
            ],
          },
        ],
      },
    },
  },
  {
    id: "risk-analysis",
    name: "リスク分析",
    description: "プロジェクトのリスクを特定し、対策を検討",
    category: "リスク管理",
    icon: "⚠️",
    data: {
      root: {
        id: "root",
        label: "リスク分析",
        children: [
          {
            id: "high-risk",
            label: "🔴 高リスク（即対応）",
            children: [
              {
                id: "hr-1",
                label: "外部API障害",
                children: [
                  { id: "hr-1-impact", label: "影響：サービス停止", children: [] },
                  { id: "hr-1-action", label: "対策：Fallback機能実装", children: [] },
                ],
              },
            ],
          },
          {
            id: "medium-risk",
            label: "🟡 中リスク（監視）",
            children: [
              {
                id: "mr-1",
                label: "リソース不足",
                children: [
                  { id: "mr-1-action", label: "対策：優先順位調整", children: [] },
                ],
              },
            ],
          },
          {
            id: "low-risk",
            label: "🟢 低リスク（受容）",
            children: [
              { id: "lr-1", label: "マイナーなUI不具合", children: [] },
            ],
          },
        ],
      },
    },
  },
  {
    id: "sprint-planning",
    name: "スプリント計画",
    description: "アジャイル開発のスプリント計画",
    category: "開発",
    icon: "🏃",
    data: {
      root: {
        id: "root",
        label: "Sprint計画",
        children: [
          {
            id: "sprint-goal",
            label: "🎯 スプリントゴール",
            children: [
              { id: "goal-1", label: "ユーザー認証機能の完成", children: [] },
            ],
          },
          {
            id: "committed",
            label: "✅ コミット（必達）",
            children: [
              { id: "com-1", label: "ユーザーストーリー #123", children: [] },
              { id: "com-2", label: "ユーザーストーリー #124", children: [] },
            ],
          },
          {
            id: "stretch",
            label: "🎁 ストレッチ（余裕があれば）",
            children: [
              { id: "str-1", label: "UI改善 #130", children: [] },
            ],
          },
          {
            id: "blocked",
            label: "🚫 ブロッカー",
            children: [
              { id: "block-1", label: "デザインレビュー待ち", children: [] },
            ],
          },
        ],
      },
    },
  },
  {
    id: "priority-matrix",
    name: "優先順位マトリクス",
    description: "重要度・緊急度による優先順位付け",
    category: "戦略",
    icon: "📊",
    data: {
      root: {
        id: "root",
        label: "優先順位",
        children: [
          {
            id: "p1",
            label: "🔴 P1（重要&緊急）",
            children: [
              { id: "p1-1", label: "本番障害対応", children: [] },
              { id: "p1-2", label: "セキュリティ脆弱性修正", children: [] },
            ],
          },
          {
            id: "p2",
            label: "🟡 P2（重要・非緊急）",
            children: [
              { id: "p2-1", label: "新機能開発", children: [] },
              { id: "p2-2", label: "技術的負債解消", children: [] },
            ],
          },
          {
            id: "p3",
            label: "🟢 P3（非重要・緊急）",
            children: [
              { id: "p3-1", label: "急なミーティング", children: [] },
            ],
          },
          {
            id: "p4",
            label: "⚪ P4（非重要・非緊急）",
            children: [
              { id: "p4-1", label: "UI微調整", children: [] },
              { id: "p4-2", label: "ドキュメント整理", children: [] },
            ],
          },
        ],
      },
    },
  },
];

export const getPMTemplateById = (id: string): Template | undefined => {
  return pmTemplates.find((t) => t.id === id);
};

export const getAllPMTemplates = (): Template[] => {
  return pmTemplates;
};

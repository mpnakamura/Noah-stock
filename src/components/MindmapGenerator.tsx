"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface MindmapGeneratorProps {
  onGenerate: (requirements: string) => Promise<void>;
  isLoading: boolean;
}

export function MindmapGenerator({ onGenerate, isLoading }: MindmapGeneratorProps) {
  const [requirements, setRequirements] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.trim()) {
      onGenerate(requirements);
    }
  };

  const exampleRequirements = `PMスキル、テクニカルスキル、デザイン・UX、データ分析、ソフトスキル、プロジェクトマネジメント、ビジネス戦略、プロダクトマネジメント、AI、方法論などのスキル体系`;

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        📝 要件入力
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="flex-1 mb-4">
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            プロジェクトの要件やアイデアを入力してください
          </label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder={exampleRequirements}
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !requirements.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              マインドマップを生成
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          💡 ヒント
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• プロジェクトのゴールや要件を詳しく記述してください</li>
          <li>• スキルセット、機能要件、技術スタックなど具体的に</li>
          <li>• AIが階層的な構造を自動生成します</li>
        </ul>
      </div>
    </div>
  );
}

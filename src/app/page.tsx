"use client";

import { useState, useCallback } from "react";
import { MindmapGenerator } from "@/components/MindmapGenerator";
import { MindmapViewer } from "@/components/MindmapViewer";
import { TemplateSelector } from "@/components/TemplateSelector";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { MindmapData, Template, SavedMindmap } from "@/types/mindmap";
import { saveToHistory } from "@/lib/storage";
import { Save } from "lucide-react";

export default function Home() {
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const handleGenerate = async (requirements: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requirements }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate mindmap");
      }

      const data = await response.json();
      setMindmapData(data.mindmap);
      setCurrentId(null);
    } catch (error) {
      console.error("Error generating mindmap:", error);
      alert("マインドマップの生成に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setMindmapData(template.data);
    setCurrentId(null);
  };

  const handleLoadFromHistory = (savedMindmap: SavedMindmap) => {
    setMindmapData(savedMindmap.data);
    setCurrentId(savedMindmap.id);
  };

  const handleSave = () => {
    if (!mindmapData) return;

    const name = prompt("マインドマップの名前を入力してください", mindmapData.root.label);
    if (!name) return;

    const saved = saveToHistory(name, mindmapData);
    setCurrentId(saved.id);
    alert("マインドマップを保存しました！");

    // 履歴パネルを更新するためにキーを変更
    window.dispatchEvent(new Event("mindmap-saved"));
  };

  const handleMindmapChange = useCallback((data: MindmapData) => {
    setMindmapData(data);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🎯 AI PM Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Phase 2.5: PM業務を支援する対話型マインドマップツール
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側: 入力フォーム、テンプレート、履歴 */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <MindmapGenerator
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <TemplateSelector onSelectTemplate={handleTemplateSelect} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <HistoryPanel
                onLoad={handleLoadFromHistory}
                onHistoryChange={() => window.location.reload()}
              />
            </div>
          </div>

          {/* 中央: マインドマップ表示 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {mindmapData && !isLoading && (
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  title="マインドマップを保存"
                >
                  <Save className="w-4 h-4" />
                  履歴に保存
                </button>
                {currentId && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    ✓ 保存済み
                  </span>
                )}
              </div>
            )}

            <MindmapViewer
              mindmapData={mindmapData}
              isLoading={isLoading}
              isEditable={true}
              onChange={handleMindmapChange}
            />
          </div>

          {/* 右側: AIチャット */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:sticky lg:top-8 lg:self-start" style={{ minHeight: "600px" }}>
            <ChatPanel
              mindmapData={mindmapData}
              onMindmapUpdate={handleMindmapChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

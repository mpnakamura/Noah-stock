"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MindmapViewer } from "@/components/MindmapViewer";
import { FloatingChat } from "@/components/FloatingChat";
import { MindmapData, Template, SavedMindmap } from "@/types/mindmap";
import { saveToHistory } from "@/lib/storage";
import { Save } from "lucide-react";

export default function Home() {
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      {/* サイドバー */}
      <Sidebar
        onGenerate={handleGenerate}
        onTemplateSelect={handleTemplateSelect}
        onLoadFromHistory={handleLoadFromHistory}
        isLoading={isLoading}
        onOpenChange={setSidebarOpen}
      />

      {/* メインコンテンツ */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'pl-[380px]' : 'pl-0'}`}>
        <div className="h-screen p-4">
          {/* マインドマップ表示エリア */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full">
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

            <div className="h-full" style={{ height: mindmapData ? "calc(100% - 60px)" : "100%" }}>
              <MindmapViewer
                mindmapData={mindmapData}
                isLoading={isLoading}
                isEditable={true}
                onChange={handleMindmapChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* フローティングチャット */}
      <FloatingChat
        mindmapData={mindmapData}
        onMindmapUpdate={handleMindmapChange}
      />
    </div>
  );
}

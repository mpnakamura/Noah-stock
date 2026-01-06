"use client";

import { useState } from "react";
import { MindmapGenerator } from "@/components/MindmapGenerator";
import { MindmapViewer } from "@/components/MindmapViewer";
import { MindmapData } from "@/types/mindmap";

export default function Home() {
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.error("Error generating mindmap:", error);
      alert("マインドマップの生成に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🧠 AI Mindmap Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            要件を入力すると、AIが自動的にマインドマップを生成します
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側: 入力フォーム */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <MindmapGenerator
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* 右側: マインドマップ表示 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <MindmapViewer mindmapData={mindmapData} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

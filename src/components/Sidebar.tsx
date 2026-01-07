"use client";

import { useState } from "react";
import { MindmapGenerator } from "./MindmapGenerator";
import { TemplateSelector } from "./TemplateSelector";
import { HistoryPanel } from "./HistoryPanel";
import { Template, SavedMindmap } from "@/types/mindmap";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  onGenerate: (requirements: string) => Promise<void>;
  onTemplateSelect: (template: Template) => void;
  onLoadFromHistory: (mindmap: SavedMindmap) => void;
  isLoading: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function Sidebar({
  onGenerate,
  onTemplateSelect,
  onLoadFromHistory,
  isLoading,
  onOpenChange,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  return (
    <>
      {/* サイドバー */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 z-40 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "380px" }}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              メニュー
            </h2>
            <button
              onClick={() => toggleOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <MindmapGenerator onGenerate={onGenerate} isLoading={isLoading} />
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <TemplateSelector onSelectTemplate={onTemplateSelect} />
          </div>

          <div>
            <HistoryPanel
              onLoad={onLoadFromHistory}
              onHistoryChange={() => window.location.reload()}
            />
          </div>
        </div>
      </div>

      {/* トグルボタン */}
      <button
        onClick={() => toggleOpen(!isOpen)}
        className={`fixed top-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg shadow-lg transition-all duration-300 ${
          isOpen ? "left-[380px]" : "left-0"
        }`}
        title={isOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* オーバーレイ（モバイル用） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => toggleOpen(false)}
        />
      )}
    </>
  );
}

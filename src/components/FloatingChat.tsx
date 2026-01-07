"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { MindmapData } from "@/types/mindmap";

interface FloatingChatProps {
  mindmapData: MindmapData | null;
  onMindmapUpdate: (data: MindmapData) => void;
}

export function FloatingChat({ mindmapData, onMindmapUpdate }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* チャットウィンドウ */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 rounded-t-lg">
            <div className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">AI PM Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-700 rounded text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* チャットコンテンツ */}
          <div className="flex-1 overflow-hidden p-4">
            <ChatPanel
              mindmapData={mindmapData}
              onMindmapUpdate={onMindmapUpdate}
            />
          </div>
        </div>
      )}

      {/* フローティングボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 z-50 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
        title="AIチャットを開く"
      >
        <MessageSquare className="w-6 h-6" />
        {mindmapData && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </button>
    </>
  );
}

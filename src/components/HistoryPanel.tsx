"use client";

import { useEffect, useState } from "react";
import { SavedMindmap } from "@/types/mindmap";
import { getHistory, deleteFromHistory } from "@/lib/storage";
import { History, Clock, Trash2 } from "lucide-react";

interface HistoryPanelProps {
  onLoad: (mindmap: SavedMindmap) => void;
  onHistoryChange?: () => void;
}

export function HistoryPanel({ onLoad, onHistoryChange }: HistoryPanelProps) {
  const [history, setHistory] = useState<SavedMindmap[]>([]);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  useEffect(() => {
    loadHistory();

    const handleSave = () => loadHistory();
    window.addEventListener("mindmap-saved", handleSave);

    return () => {
      window.removeEventListener("mindmap-saved", handleSave);
    };
  }, []);

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm("このマインドマップを履歴から削除しますか？")) {
      deleteFromHistory(id);
      loadHistory();
      onHistoryChange?.();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "たった今";
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;

    return date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    });
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">履歴はまだありません</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <History className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          最近の履歴
        </h3>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onLoad(item)}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {item.name}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(item.updatedAt)}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => handleDelete(item.id, e)}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-opacity"
              title="削除"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

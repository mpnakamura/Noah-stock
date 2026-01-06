"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, MindmapData } from "@/types/mindmap";
import { Send, Loader2, MessageSquare, Lightbulb } from "lucide-react";

interface ChatPanelProps {
  mindmapData: MindmapData | null;
  onMindmapUpdate: (data: MindmapData) => void;
}

export function ChatPanel({ mindmapData, onMindmapUpdate }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !mindmapData || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          currentMindmap: mindmapData,
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // マインドマップの更新があれば適用
      if (data.action === "update" && data.mindmap) {
        onMindmapUpdate(data.mindmap);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "エラーが発生しました。もう一度お試しください。",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "詳細化して", icon: "🔍" },
    { label: "リスクを分析して", icon: "⚠️" },
    { label: "何が足りない？", icon: "🤔" },
    { label: "スコープを絞って", icon: "✂️" },
  ];

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  if (!mindmapData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6">
        <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-center">
          マインドマップを生成すると
          <br />
          AIと対話できます
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          AI PM Assistant
        </h3>
      </div>

      {/* クイックアクション */}
      {messages.length === 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              クイックアクション
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.label)}
                className="text-left px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <span className="mr-1">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            AIに質問して、マインドマップをブラッシュアップしましょう
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user"
                    ? "text-blue-200"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="例：「詳細化して」「リスクを分析して」"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          title="送信"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ヒント */}
      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
        💡 ヒント：「〇〇を詳しく」「〇〇のリスクは？」「スコープを絞って」など
      </div>
    </div>
  );
}

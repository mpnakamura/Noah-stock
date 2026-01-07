import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MindmapData, ChatMessage } from "@/types/mindmap";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CHAT_SYSTEM_PROMPT = `あなたは経験豊富なプロダクトマネージャー（PM）のアシスタントです。
現在、ユーザーはマインドマップを作成しており、あなたとの対話を通じてそれをブラッシュアップしています。

**あなたの役割：**
1. マインドマップの改善提案
2. 不足している観点の指摘
3. PM視点での質問とアドバイス
4. スコープの絞り込み支援（引き算の意思決定）

**対話のスタイル：**
- 簡潔で実践的
- 具体的な提案
- 「やらないこと」を明確にする
- トレードオフを意識させる

**対応パターン：**
1. 「詳細化して」→ 指定されたノードを詳細に分解
2. 「リスクを分析して」→ リスクと対策を提案
3. 「何が足りない？」→ 不足している観点を指摘
4. 「スコープを絞って」→ やらないことを提案
5. 「優先順位をつけて」→ P0/P1/P2で分類提案

マインドマップの更新が必要な場合は、JSON形式で返してください。
それ以外の場合は、通常のテキストで回答してください。`;

interface ChatRequest {
  message: string;
  currentMindmap: MindmapData;
  chatHistory: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const { message, currentMindmap, chatHistory }: ChatRequest = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // 会話履歴を構築
    const conversationMessages: Anthropic.MessageParam[] = [];

    // 過去のチャット履歴を追加
    chatHistory.forEach((msg) => {
      conversationMessages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    });

    // 現在のマインドマップの状態をコンテキストとして含める
    const contextMessage = `現在のマインドマップ:
${JSON.stringify(currentMindmap, null, 2)}

ユーザーのリクエスト: ${message}

マインドマップの更新が必要な場合は、以下のJSON形式で返してください：
{
  "action": "update",
  "mindmap": { ... 更新後のマインドマップ全体 ... }
}

アドバイスのみの場合は、以下の形式で返してください：
{
  "action": "advice",
  "message": "アドバイスの内容"
}`;

    conversationMessages.push({
      role: "user",
      content: contextMessage,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      temperature: 0.7,
      system: CHAT_SYSTEM_PROMPT,
      messages: conversationMessages,
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }

    let responseText = textContent.text.trim();

    // JSONレスポンスかどうかを判定
    try {
      // コードブロックを削除
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      }

      const parsed = JSON.parse(responseText);

      if (parsed.action === "update" && parsed.mindmap) {
        // マインドマップの更新
        return NextResponse.json({
          action: "update",
          mindmap: parsed.mindmap,
          message: "マインドマップを更新しました",
        });
      } else if (parsed.action === "advice") {
        // アドバイスのみ
        return NextResponse.json({
          action: "advice",
          message: parsed.message,
        });
      }
    } catch (e) {
      // JSONパースエラー = 通常のテキストレスポンス
      return NextResponse.json({
        action: "advice",
        message: responseText,
      });
    }

    // フォールバック
    return NextResponse.json({
      action: "advice",
      message: responseText,
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

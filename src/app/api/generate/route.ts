import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MindmapData } from "@/types/mindmap";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたはマインドマップ生成の専門家です。ユーザーから提供された要件やアイデアを分析し、階層的で構造化されたマインドマップを生成してください。

マインドマップの構造:
- ルートノード: メインテーマ・コンセプト
- 第1階層: 主要なカテゴリ
- 第2階層以降: サブカテゴリ、具体的な要素

重要なルール:
1. 階層は3-5レベルまで
2. 各ノードは簡潔で分かりやすいラベル（5-15文字程度）
3. 論理的で意味のある階層構造
4. 同じ階層のノード数は2-8個程度が理想的
5. PM（プロダクトマネージャー）の視点で、実用的で網羅的な構造を作成

出力は必ず以下のJSON形式で返してください:

{
  "root": {
    "id": "root",
    "label": "ルートノードのラベル",
    "children": [
      {
        "id": "node-1",
        "label": "第1階層ノード1",
        "children": [
          {
            "id": "node-1-1",
            "label": "第2階層ノード1-1",
            "children": []
          }
        ]
      }
    ]
  }
}

JSONのみを返し、他の説明文は含めないでください。`;

export async function POST(request: NextRequest) {
  try {
    const { requirements } = await request.json();

    if (!requirements || typeof requirements !== "string") {
      return NextResponse.json(
        { error: "Requirements is required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `以下の要件・アイデアから、階層的なマインドマップを生成してください:\n\n${requirements}`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }

    // JSONを抽出（コードブロックに包まれている場合を考慮）
    let jsonText = textContent.text.trim();

    // マークダウンのコードブロックを削除
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    }

    const mindmapData: MindmapData = JSON.parse(jsonText);

    // データ検証
    if (!mindmapData.root || !mindmapData.root.id || !mindmapData.root.label) {
      throw new Error("Invalid mindmap structure");
    }

    return NextResponse.json({ mindmap: mindmapData });
  } catch (error) {
    console.error("Error generating mindmap:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate mindmap" },
      { status: 500 }
    );
  }
}

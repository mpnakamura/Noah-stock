import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MindmapData } from "@/types/mindmap";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは経験豊富なプロダクトマネージャー（PM）です。
ユーザーの要求に対して、PM視点で実践的なマインドマップを生成してください。

**PM視点の重要原則：引き算の意思決定**

1. **スコープの明確化**
   - ✅ やること（Scope In）: 必須機能、MVPに含めるもの
   - ❌ やらないこと（Scope Out）: 後回し、優先度が低いもの
   - 理由を明記（例：「後回し → Phase 2で検討」）

2. **優先順位付け**
   - P0/P1: 必須（MVPに含む）
   - P2: 重要だが後回し可能
   - P3: Nice to have

3. **リスクとトレードオフ**
   - ⚠️ 技術リスク、スケジュールリスク、依存関係
   - 🔄 トレードオフ：速度 vs 品質、柔軟性 vs シンプルさ
   - 各リスクに対する対策を提示

4. **実装可能性**
   - 現実的なタスク分解
   - 依存関係の明示
   - クリティカルパスの特定

**マインドマップ構造のガイドライン：**
- ルートノード: メインテーマ
- 第1階層: 「やること」「やらないこと」「リスク」「トレードオフ」などの観点
- 第2-3階層: 具体的な項目と理由
- 階層は3-5レベルまで
- ノードラベルは簡潔（5-20文字）
- 絵文字を活用（✅ ❌ ⚠️ 🔄 📊など）

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
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `以下の要件に対して、PM視点で実践的なマインドマップを生成してください。

要件：
${requirements}

以下の観点を含めてください：
1. ✅ やること（Scope In）- 必須機能、MVPに含めるもの
2. ❌ やらないこと（Scope Out）- 後回し、優先度が低いもの（理由付き）
3. ⚠️ リスク・課題 - 技術/スケジュール/依存関係のリスクと対策
4. 🔄 トレードオフ - 意思決定のポイント

実践的で実装可能な構造にしてください。`,
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

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
- **階層は最大4レベルまで（深すぎると複雑になる）**
- **1つの親ノードの子ノードは最大8個まで（多すぎると見づらい）**
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

**重要なJSON生成ルール：**
1. **完全かつ有効なJSONのみ**を返す（説明文やコメントは含めない）
2. すべてのノードに "id", "label", "children" プロパティを必ず含める
3. "children" は必ず配列（子がない場合は空配列 []）
4. オブジェクトの最後のプロパティの後にカンマを付けない
5. 文字列内の二重引用符は \" でエスケープする
6. **すべての括弧 [ ] とブレース { } を必ず閉じる（重要！）**
7. **JSONが途中で切れないように、完結させる**

生成前に以下を確認：
- ルートの { で始まり、} で終わる
- すべての開き括弧に対応する閉じ括弧がある
- 構文エラーがない完全なJSON

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
      max_tokens: 8192, // JSONが途中で切れないように増やす
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
      jsonText = jsonText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    }

    // JSONをクリーンアップ
    try {
      // trailing commasを削除（配列内）
      jsonText = jsonText.replace(/,\s*]/g, "]");
      // trailing commasを削除（オブジェクト内）
      jsonText = jsonText.replace(/,\s*}/g, "}");
      // 制御文字を削除
      jsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    } catch (cleanupError) {
      console.error("Error cleaning JSON:", cleanupError);
    }

    // JSONの括弧バランスをチェックして修復
    const fixBrackets = (json: string): string => {
      let openBraces = 0;
      let openBrackets = 0;
      let inString = false;
      let escaped = false;

      for (let i = 0; i < json.length; i++) {
        const char = json[i];

        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === "\\") {
          escaped = true;
          continue;
        }

        if (char === '"') {
          inString = !inString;
          continue;
        }

        if (inString) continue;

        if (char === "{") openBraces++;
        if (char === "}") openBraces--;
        if (char === "[") openBrackets++;
        if (char === "]") openBrackets--;
      }

      // 不足している括弧を追加
      let fixed = json;
      for (let i = 0; i < openBrackets; i++) {
        fixed += "]";
      }
      for (let i = 0; i < openBraces; i++) {
        fixed += "}";
      }

      return fixed;
    };

    let mindmapData: MindmapData | undefined;

    try {
      mindmapData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON Parse Error Details:");
      console.error("Error:", parseError);
      console.error("JSON length:", jsonText.length);

      // 括弧の修復を試みる
      console.log("Attempting to fix brackets...");
      const fixedJson = fixBrackets(jsonText);

      if (fixedJson !== jsonText) {
        console.log(
          "Brackets were added:",
          fixedJson.length - jsonText.length,
          "characters"
        );
        try {
          mindmapData = JSON.parse(fixedJson);
          console.log("✓ Successfully parsed fixed JSON!");
        } catch (fixError) {
          console.error("✗ Failed to parse even after fixing brackets");
          console.error("Fix Error:", fixError);
        }
      }

      // 修復が成功していない場合のみ詳細エラーログを出力
      if (!mindmapData) {
        console.error(
          "JSON preview (first 500 chars):",
          jsonText.substring(0, 500)
        );
        console.error(
          "JSON preview (last 500 chars):",
          jsonText.substring(Math.max(0, jsonText.length - 500))
        );

        if (parseError instanceof SyntaxError) {
          // エラー位置付近のテキストを表示
          const match = parseError.message.match(/position (\d+)/);
          if (match) {
            const pos = parseInt(match[1]);
            const start = Math.max(0, pos - 100);
            const end = Math.min(jsonText.length, pos + 100);
            console.error(
              `Context around error position ${pos}:`,
              jsonText.substring(start, end)
            );
          }
        }

        throw new Error(
          `Invalid JSON from AI: ${
            parseError instanceof Error ? parseError.message : "Unknown error"
          }`
        );
      }
    }

    // 型チェック（mindmapDataが存在することを保証）
    if (!mindmapData) {
      throw new Error("Failed to parse mindmap data");
    }

    // データ検証
    if (!mindmapData.root || !mindmapData.root.id || !mindmapData.root.label) {
      throw new Error("Invalid mindmap structure");
    }

    return NextResponse.json({ mindmap: mindmapData });
  } catch (error) {
    console.error("Error generating mindmap:", error);

    if (error instanceof Error) {
      // エラーメッセージをより詳細に返す
      const errorMessage = error.message.includes("Invalid JSON")
        ? "AIが不正なJSON形式を生成しました。もう一度お試しください。"
        : error.message.includes("No text content")
        ? "AIからの応答が空でした。もう一度お試しください。"
        : error.message.includes("Invalid mindmap structure")
        ? "マインドマップの構造が不正です。もう一度お試しください。"
        : "マインドマップの生成中にエラーが発生しました。";

      return NextResponse.json(
        {
          error: errorMessage,
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }
}

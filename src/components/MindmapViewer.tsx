"use client";

import { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Download, FileJson, Image as ImageIcon, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { MindmapData, MindmapNode } from "@/types/mindmap";

interface MindmapViewerProps {
  mindmapData: MindmapData | null;
  isLoading: boolean;
}

export function MindmapViewer({ mindmapData, isLoading }: MindmapViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const convertToReactFlowNodes = useCallback((data: MindmapData): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;

    const processNode = (
      node: MindmapNode,
      level: number,
      parentId: string | null,
      parentX: number,
      parentY: number,
      siblingIndex: number,
      totalSiblings: number
    ) => {
      const id = `node-${nodeId++}`;

      // 階層ごとの水平間隔と垂直間隔
      const horizontalSpacing = 250;
      const verticalSpacing = 100;

      // X座標: 階層レベルに基づいて配置
      const x = level * horizontalSpacing;

      // Y座標: 兄弟ノード間で均等に配置
      let y: number;
      if (level === 0) {
        y = 300; // ルートノードは中央
      } else {
        const totalHeight = (totalSiblings - 1) * verticalSpacing;
        const startY = parentY - totalHeight / 2;
        y = startY + siblingIndex * verticalSpacing;
      }

      // ノードの色を階層ごとに変える
      const colors = [
        { bg: "#3b82f6", border: "#2563eb", text: "#ffffff" }, // ルート: 青
        { bg: "#8b5cf6", border: "#7c3aed", text: "#ffffff" }, // レベル1: 紫
        { bg: "#ec4899", border: "#db2777", text: "#ffffff" }, // レベル2: ピンク
        { bg: "#f59e0b", border: "#d97706", text: "#ffffff" }, // レベル3: オレンジ
        { bg: "#10b981", border: "#059669", text: "#ffffff" }, // レベル4+: 緑
      ];
      const color = colors[Math.min(level, colors.length - 1)];

      nodes.push({
        id,
        type: "default",
        position: { x, y },
        data: {
          label: node.label,
        },
        style: {
          background: color.bg,
          color: color.text,
          border: `2px solid ${color.border}`,
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: level === 0 ? "16px" : "14px",
          fontWeight: level === 0 ? "bold" : "normal",
          minWidth: "150px",
          textAlign: "center",
        },
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: "smoothstep",
          animated: level === 1,
          style: {
            stroke: color.border,
            strokeWidth: 2,
          },
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
          processNode(child, level + 1, id, x, y, index, node.children!.length);
        });
      }
    };

    processNode(data.root, 0, null, 0, 300, 0, 1);

    return { nodes, edges };
  }, []);

  useEffect(() => {
    if (mindmapData) {
      const { nodes: newNodes, edges: newEdges } = convertToReactFlowNodes(mindmapData);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [mindmapData, convertToReactFlowNodes, setNodes, setEdges]);

  const exportAsJSON = useCallback(() => {
    if (!mindmapData) return;

    const dataStr = JSON.stringify(mindmapData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mindmap-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [mindmapData]);

  const exportAsPNG = useCallback(() => {
    if (!reactFlowWrapper.current) return;

    const element = reactFlowWrapper.current.querySelector(".react-flow__viewport") as HTMLElement;
    if (!element) return;

    toPng(element, {
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `mindmap-${Date.now()}.png`;
        link.click();
      })
      .catch((error) => {
        console.error("Failed to export as PNG:", error);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg">AIがマインドマップを生成中...</p>
      </div>
    );
  }

  if (!mindmapData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">🗺️</div>
        <p className="text-lg">要件を入力してマインドマップを生成してください</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          🗺️ マインドマップ
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportAsJSON}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            title="JSONとしてエクスポート"
          >
            <FileJson className="w-4 h-4" />
            JSON
          </button>
          <button
            onClick={exportAsPNG}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            title="画像としてエクスポート"
          >
            <ImageIcon className="w-4 h-4" />
            PNG
          </button>
        </div>
      </div>

      <div ref={reactFlowWrapper} className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              return node.style?.background as string || "#3b82f6";
            }}
          />
          <Panel position="top-right" className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300">
            <div>💡 ドラッグで移動、マウスホイールでズーム</div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

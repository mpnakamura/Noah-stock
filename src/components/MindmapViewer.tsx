"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  NodeMouseHandler,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Download,
  FileJson,
  Image as ImageIcon,
  Loader2,
  Edit3,
  Save,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { toPng } from "html-to-image";
import { MindmapData, MindmapNode } from "@/types/mindmap";

interface MindmapViewerProps {
  mindmapData: MindmapData | null;
  isLoading: boolean;
  isEditable?: boolean;
  onChange?: (data: MindmapData) => void;
}

interface NodeData {
  label: string;
  mindmapId: string;
  level: number;
}

export function MindmapViewer({
  mindmapData,
  isLoading,
  isEditable = false,
  onChange,
}: MindmapViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // MindmapNode IDからReact Flow NodeへのマッピングMap
  const [nodeIdMap, setNodeIdMap] = useState<Map<string, string>>(new Map());

  const convertToReactFlowNodes = useCallback(
    (
      data: MindmapData
    ): {
      nodes: Node<NodeData>[];
      edges: Edge[];
      idMap: Map<string, string>;
    } => {
      const nodes: Node<NodeData>[] = [];
      const edges: Edge[] = [];
      const idMap = new Map<string, string>();
      let nodeCounter = 0;

      const horizontalSpacing = 300; // 階層間の横方向の間隔
      const verticalSpacing = 60; // ノード間の最小縦方向の間隔
      const nodeHeight = 60; // 各ノードの高さの推定値

      // サブツリー全体の高さを計算する関数
      const calculateSubtreeHeight = (node: MindmapNode): number => {
        if (!node.children || node.children.length === 0) {
          return nodeHeight;
        }
        // 子ノードのサブツリーの高さの合計 + 間隔
        const childrenHeight = node.children.reduce((sum, child) => {
          return sum + calculateSubtreeHeight(child);
        }, 0);
        const spacingHeight = (node.children.length - 1) * verticalSpacing;
        return Math.max(nodeHeight, childrenHeight + spacingHeight);
      };

      // 左から右への横方向レイアウト
      const processNode = (
        node: MindmapNode,
        level: number,
        parentFlowId: string | null,
        yOffset: number
      ): number => {
        const flowId = `flow-node-${nodeCounter++}`;
        idMap.set(node.id, flowId);

        // X座標は階層に応じて右に移動（左から右へ）
        const x = level * horizontalSpacing;

        // サブツリーの高さを計算
        const subtreeHeight = calculateSubtreeHeight(node);

        // このノードのY座標は、サブツリーの中央に配置
        const y = yOffset + subtreeHeight / 2 - nodeHeight / 2;

        const colors = [
          { bg: "#3b82f6", border: "#2563eb", text: "#ffffff" },
          { bg: "#8b5cf6", border: "#7c3aed", text: "#ffffff" },
          { bg: "#ec4899", border: "#db2777", text: "#ffffff" },
          { bg: "#f59e0b", border: "#d97706", text: "#ffffff" },
          { bg: "#10b981", border: "#059669", text: "#ffffff" },
        ];
        const color = colors[Math.min(level, colors.length - 1)];

        nodes.push({
          id: flowId,
          type: "default",
          position: { x, y },
          sourcePosition: Position.Right, // このノードから右側に線が出る
          targetPosition: Position.Left, // このノードへ左側から線が入る
          data: {
            label: node.label,
            mindmapId: node.id,
            level,
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
            cursor: editMode ? "pointer" : "grab",
          },
        });

        if (parentFlowId) {
          edges.push({
            id: `edge-${parentFlowId}-${flowId}`,
            source: parentFlowId,
            target: flowId,
            type: "smoothstep",
            animated: level === 1,
            style: {
              stroke: color.border,
              strokeWidth: 2,
            },
          });
        }

        // 子ノードを配置
        if (node.children && node.children.length > 0) {
          let currentY = yOffset;
          node.children.forEach((child) => {
            const childSubtreeHeight = calculateSubtreeHeight(child);
            currentY = processNode(child, level + 1, flowId, currentY);
            currentY += verticalSpacing; // 次の兄弟との間隔
          });
        }

        // このサブツリーが使用した高さを返す
        return yOffset + subtreeHeight;
      };

      processNode(data.root, 0, null, 0);
      return { nodes, edges, idMap };
    },
    [editMode]
  );

  useEffect(() => {
    if (mindmapData) {
      const {
        nodes: newNodes,
        edges: newEdges,
        idMap,
      } = convertToReactFlowNodes(mindmapData);
      setNodes(newNodes);
      setEdges(newEdges);
      setNodeIdMap(idMap);
    }
  }, [mindmapData, convertToReactFlowNodes, setNodes, setEdges]);

  const findNodeById = useCallback(
    (data: MindmapNode, id: string): MindmapNode | null => {
      if (data.id === id) return data;
      if (data.children) {
        for (const child of data.children) {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const updateNodeLabel = useCallback(
    (data: MindmapNode, id: string, newLabel: string): MindmapNode => {
      if (data.id === id) {
        return { ...data, label: newLabel };
      }
      if (data.children) {
        return {
          ...data,
          children: data.children.map((child) =>
            updateNodeLabel(child, id, newLabel)
          ),
        };
      }
      return data;
    },
    []
  );

  const addChildNode = useCallback(
    (data: MindmapNode, parentId: string): MindmapNode => {
      if (data.id === parentId) {
        const newChild: MindmapNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          label: "新しいノード",
          children: [],
        };
        return {
          ...data,
          children: [...(data.children || []), newChild],
        };
      }
      if (data.children) {
        return {
          ...data,
          children: data.children.map((child) => addChildNode(child, parentId)),
        };
      }
      return data;
    },
    []
  );

  const deleteNode = useCallback(
    (data: MindmapNode, id: string): MindmapNode | null => {
      if (data.id === id) return null;
      if (data.children) {
        const filteredChildren = data.children
          .map((child) => deleteNode(child, id))
          .filter((child): child is MindmapNode => child !== null);
        return { ...data, children: filteredChildren };
      }
      return data;
    },
    []
  );

  const handleNodeDoubleClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (!editMode || !isEditable) return;
      const nodeData = node.data as NodeData;
      setEditingNodeId(nodeData.mindmapId);
      setEditingLabel(nodeData.label);
    },
    [editMode, isEditable]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!editMode || !isEditable) return;
      event.preventDefault();
      const nodeData = node.data as NodeData;
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: nodeData.mindmapId,
      });
      setSelectedNodeId(nodeData.mindmapId);
    },
    [editMode, isEditable]
  );

  const handleSaveEdit = useCallback(() => {
    if (!editingNodeId || !mindmapData || !onChange) return;
    const updatedData = {
      root: updateNodeLabel(mindmapData.root, editingNodeId, editingLabel),
    };
    onChange(updatedData);
    setEditingNodeId(null);
    setEditingLabel("");
  }, [editingNodeId, editingLabel, mindmapData, onChange, updateNodeLabel]);

  const handleAddChild = useCallback(() => {
    if (!selectedNodeId || !mindmapData || !onChange) return;
    const updatedData = {
      root: addChildNode(mindmapData.root, selectedNodeId),
    };
    onChange(updatedData);
    setContextMenu(null);
  }, [selectedNodeId, mindmapData, onChange, addChildNode]);

  const handleDelete = useCallback(() => {
    if (
      !selectedNodeId ||
      !mindmapData ||
      !onChange ||
      selectedNodeId === mindmapData.root.id
    ) {
      alert("ルートノードは削除できません");
      return;
    }
    const updatedData = deleteNode(mindmapData.root, selectedNodeId);
    if (updatedData) {
      onChange({ root: updatedData });
    }
    setContextMenu(null);
  }, [selectedNodeId, mindmapData, onChange, deleteNode]);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

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
    const element = reactFlowWrapper.current.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement;
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
        <p className="text-lg">
          要件を入力してマインドマップを生成してください
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ height: "100%" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          🗺️ マインドマップ
        </h2>
        <div className="flex gap-2">
          {isEditable && (
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                editMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              }`}
              title="編集モード"
            >
              {editMode ? (
                <Save className="w-4 h-4" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
              {editMode ? "編集中" : "編集"}
            </button>
          )}
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

      <div
        ref={reactFlowWrapper}
        className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 relative"
        style={{ minHeight: "500px" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeContextMenu={handleNodeContextMenu}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              return (node.style?.background as string) || "#3b82f6";
            }}
          />
          <Panel
            position="top-right"
            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300"
          >
            <div>
              {editMode
                ? "✏️ ダブルクリックで編集、右クリックでメニュー"
                : "💡 ドラッグで移動、マウスホイールでズーム"}
            </div>
          </Panel>
        </ReactFlow>

        {contextMenu && editMode && (
          <div
            className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={handleAddChild}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white w-full text-left text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              子ノードを追加
            </button>
            {selectedNodeId !== mindmapData.root.id && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 w-full text-left text-sm"
              >
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            )}
          </div>
        )}

        {editingNodeId && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                ノードを編集
              </h3>
              <input
                type="text"
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setEditingNodeId(null);
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingNodeId(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

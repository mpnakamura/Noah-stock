export interface MindmapNode {
  id: string;
  label: string;
  children?: MindmapNode[];
}

export interface MindmapData {
  root: MindmapNode;
}

export interface SavedMindmap {
  id: string;
  name: string;
  data: MindmapData;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateMindmapRequest {
  requirements: string;
}

export interface GenerateMindmapResponse {
  mindmap: MindmapData;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  data: MindmapData;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatHistory {
  mindmapId: string;
  messages: ChatMessage[];
}

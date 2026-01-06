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

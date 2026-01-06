export interface MindmapNode {
  id: string;
  label: string;
  children?: MindmapNode[];
}

export interface MindmapData {
  root: MindmapNode;
}

export interface GenerateMindmapRequest {
  requirements: string;
}

export interface GenerateMindmapResponse {
  mindmap: MindmapData;
}

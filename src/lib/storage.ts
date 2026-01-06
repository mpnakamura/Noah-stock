import { SavedMindmap, MindmapData } from "@/types/mindmap";

const STORAGE_KEY = "mindmap-history";
const MAX_HISTORY = 20;

export const saveToHistory = (name: string, data: MindmapData): SavedMindmap => {
  const history = getHistory();
  const now = new Date().toISOString();

  const savedMindmap: SavedMindmap = {
    id: crypto.randomUUID(),
    name,
    data,
    createdAt: now,
    updatedAt: now,
  };

  history.unshift(savedMindmap);

  // 最大件数を超えたら古いものを削除
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return savedMindmap;
};

export const getHistory = (): SavedMindmap[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
};

export const deleteFromHistory = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateInHistory = (id: string, data: MindmapData): void => {
  const history = getHistory();
  const index = history.findIndex((item) => item.id === id);

  if (index !== -1) {
    history[index].data = data;
    history[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

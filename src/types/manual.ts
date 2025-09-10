// 手册相关类型定义
export interface ManualItem {
  id?: string | number;
  name?: string;
  title?: string;
  coordinates?: [number, number];
  priority?: number;
  location_id?: string;
  locationId?: string;
}

export interface ManualData {
  [categoryKey: string]: ManualItem[];
}

// 手册列表项（扁平化后，用于页面展示）
export interface ManualListItem {
  id: string | number;
  name: string;
  info: string;
  coordinates: [number, number];
  priority: number;
  functions: string[];
  location_id: string;
  __groupIndex: number;
  __itemIndex: number;
}

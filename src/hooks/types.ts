// ============== 数据结构类型定义 ==============

// 地图相关类型定义
export interface Coordinates {
  x: number;
  y: number;
}

export interface MapMark {
  id: string | number;
  name: string;
  coordinates: [number, number]; // 基于 data.json 的格式
  priority: number;
  info?: string;
  functions?: string[];
  offices?: string[];
  activities?: string[];
  tips?: {
    info?: Array<{
      title: string;
      content: string[];
    }>;
    functions?: Array<{
      title: string;
      content: string[];
    }>;
    offices?: Array<{
      title: string;
      content: string[];
    }>;
    activities?: Array<{
      title: string;
      content: string[];
    }>;
  };
  location_id?: string;
  locationId?: string;
}

export interface MapMarks {
  [category: string]: MapMark[];
}

// 活动相关类型定义
export interface ActivityItem {
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  location_id?: string;
  locationId?: string;
  location?: string;
  time?: string;
  type?: string;
  // optional fields that may appear in different API versions
  id?: string | number;
  coordinates?: [number, number];
  priority?: number;
  info?: string;
}

export interface ActivitiesData {
  activities?: ActivityItem[];
}

// 活动列表项（useActivities 返回的格式）
export interface ActivityListItem {
  title: string;
  location_id: string | null;
  name?: string;
  raw: ActivityItem | MapMark;
}

// Activity item extended for UI usage
export interface ActivityUIItem extends ActivityListItem {
  id: string | number;
  info?: string;
  coordinates?: [number, number];
  priority?: number;
  functions?: string[];
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

export type UIListItem = MapMark | ActivityUIItem | ManualListItem;

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



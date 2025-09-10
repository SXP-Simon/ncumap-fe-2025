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

// 地图相关类型定义
// 基于 mockData/campusMark.json 的返回结构精简后的类型定义
export interface Coordinates {
  x: number;
  y: number;
}

export interface MapMark {
  /** 标记名称，对应 API 的 `name` 字段 */
  name: string;
  /** 坐标 [经度, 纬度]，与 API 中 `coordinates` 格式一致 */
  coordinates: [number, number];
  /** 显示优先级，对应 API 的 `priority` */
  priority: number;
  /** 可选的描述信息，对应 API 的 `info`（有时为空字符串） */
  info?: string;
  /** API 原始 location_id（唯一标识） */
  location_id: string;
}

export interface MapMarks {
  [category: string]: MapMark[];
}

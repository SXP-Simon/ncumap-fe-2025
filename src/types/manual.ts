// 手册相关类型定义
// 这些类型基于 mockData/apiManual.json 的实际返回字段定义，移除未在 API 中出现的冗余字段
export interface ManualItem {
  /** 标记类型，对应 API 的 `type` 字段 */
  type: string;
  /** 标记名称，对应 API 的 `name` 字段 */
  name: string;
  /** 分类，对应 API 的 `category` 字段 */
  category: string;
  /** 坐标 [经度, 纬度]，对应 API 的 `coordinates` */
  coordinates: [number, number];
  /** 显示优先级，对应 API 的 `priority` */
  priority: number;
  /** API 原始 location_id 字段（唯一标识） */
  location_id: string;
}

export interface ManualData {
  [categoryKey: string]: ManualItem[];
}

// 手册列表项（扁平化后，用于页面展示）
export interface ManualListItem {
  /** 使用 API 的 location_id 作为唯一标识 */
  location_id: string;
  name: string;
  coordinates: [number, number];
  priority: number;
  type: string;
  category: string;
  /** 分组索引（内部UI使用） */
  __groupIndex: number;
  /** 组内项索引（内部UI使用） */
  __itemIndex: number;
}

// 活动相关类型定义
// 精简为只保留实际 API 使用的字段
export interface ActivityItem {
  /** 活动唯一标识 */
  id: string | number;
  /** 活动名称 */
  name: string;
  /** 活动内容/描述 */
  content: string;
  /** 活动位置唯一标识 */
  location_id: string;
}

export interface ActivitiesData {
  activities?: ActivityItem[];
}

// 活动列表项
export interface ActivityListItem {
  title: string;
  location_id: string | null;
  name?: string;
  raw: ActivityItem
}


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

// 活动列表项
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

import type { MapMark } from './map';
export type UIListItem = MapMark | ActivityUIItem | ManualListItem;

import type { ManualListItem } from './manual';

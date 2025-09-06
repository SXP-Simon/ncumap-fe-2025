import type { OpenMapRef } from '../components/OpenMap';
import type { useMapState } from './useMapState';
import type { useFetchData } from './useFetchData';
import type { useManual } from './useManual';

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

export interface MapData {
  marks: MapMarks | null;
  categories: string[];
  currentCategory: number;
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

// 建筑详情类型定义
export interface BuildingTip {
  title: string;
  content: string[];
}

export interface BuildingTips {
  info?: BuildingTip[];
  functions?: BuildingTip[];
  offices?: BuildingTip[];
  activities?: BuildingTip[];
}

export interface BuildingDetail {
  id: string;
  name: string;
  info: string;
  cover?: string;
  functions?: string[];
  offices?: string[];
  activities?: string[];
  imgs?: string[];
  tips: BuildingTips;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  code?: number;
  message?: string;
}

// mincu 相关类型定义
export interface MinCU {
  openUrl?: (url: string) => void;
  useAxiosInterceptors?: (axiosInstance: any) => void;
}

// ============== Hook 接口定义 ==============

// 地图操作接口
export interface MapActions {
  setMap: ReturnType<typeof useMapState>['setMap'];
  updateFromRef: ReturnType<typeof useMapState>['updateFromRef'];
  getCurrentMarks: ReturnType<typeof useMapState>['getCurrentMarks'];
}

// UI 控制接口
export interface UIActions {
  showBottomSheet: (currentCategory: string) => void;
  showManual: () => void;
  bottomSheetSelect: (index: number) => void;
  toggleCategoriesSheet: (show: boolean) => void;
  toggleManualSheet: (show: boolean) => void;
  toggleActivitiesSheet: (show: boolean) => void;
  toggleSchoolCarDialog: (show: boolean) => void;
  setSchoolCarNumber: (number: number) => void;
  setBottomSheetSelected: (index: number) => void;
}

// 导航操作接口
export interface NavigationActions {
  manualRedirect: ReturnType<typeof useManual>['manualRedirect'];
  manualSelect: ReturnType<typeof useManual>['manualSelect'];
  manualSelectOnly: ReturnType<typeof useManual>['manualSelectOnly'];
  toChatAI: () => void;
  handleFeatureSelected: (locationId: string) => void;
}

// 数据操作接口
export interface DataActions {
  getActivitiesList: () => ActivityListItem[];
}

// 页面逻辑动作集合
export interface PageLogicActions {
  mapActions: MapActions;
  uiActions: UIActions;
  navigationActions: NavigationActions;
  dataActions: DataActions;
}

// 页面状态接口
export interface PageLogicState {
  // 地图状态
  map: ReturnType<typeof useMapState>['map'];
  location: { x: number; y: number };
  
  // UI 状态
  ui: {
    isCategoriesSheetShow: boolean;
    isManualShow: boolean;
    isActivitiesSheetShow: boolean;
    schoolCarDialog: boolean;
    schoolCarNumber: number;
    bottomSheetSelected: number;
  };

  // 数据状态
  data: {
    manualData: ReturnType<typeof useFetchData>['manualData'];
    activitiesData: ReturnType<typeof useFetchData>['activitiesData'];
    manualGroupIndex: ReturnType<typeof useManual>['manualGroupIndex'];
    manualSelectedIndex: ReturnType<typeof useManual>['manualSelectedIndex'];
  };
}

// Hook 参数类型
export interface PageLogicParams {
  mapRef: React.RefObject<OpenMapRef | null>;
}

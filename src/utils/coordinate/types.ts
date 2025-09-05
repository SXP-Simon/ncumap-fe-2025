/**
 * 坐标系相关类型定义
 */

/**
 * 支持的坐标系类型
 */
export type CoordinateSystem = 'GCJ02' | 'WGS84' | 'BD09';

/**
 * 坐标点类型
 */
export interface Coordinate {
  /** 经度 */
  longitude: number;
  /** 纬度 */
  latitude: number;
  /** 坐标系类型 */
  system?: CoordinateSystem;
}

/**
 * 坐标转换配置
 */
export interface ConversionOptions {
  /** 源坐标系 */
  from: CoordinateSystem;
  /** 目标坐标系 */
  to: CoordinateSystem;
  /** 是否验证坐标范围 */
  validateRange?: boolean;
}

/**
 * 坐标转换结果
 */
export interface ConversionResult {
  /** 转换后的坐标 */
  coordinate: Coordinate;
  /** 是否转换成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 地理区域定义
 */
export interface GeoBounds {
  /** 最小经度 */
  minLongitude: number;
  /** 最大经度 */
  maxLongitude: number;
  /** 最小纬度 */
  minLatitude: number;
  /** 最大纬度 */
  maxLatitude: number;
}

/**
 * 中国大陆地理范围
 */
export const CHINA_MAINLAND_BOUNDS: GeoBounds = {
  minLongitude: 72.004,
  maxLongitude: 137.8347,
  minLatitude: 0.8293,
  maxLatitude: 55.8271,
};

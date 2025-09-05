/**
 * 坐标转换工具包
 * 
 * 提供中国常用坐标系之间的转换功能
 */

export * from './coordinateConverter';
export * from './types';

// 重新导出主要函数以保持向后兼容
export { 
  convertGcj02ToWgs84,
  isInChinaMainland,
  batchConvertGcj02ToWgs84,
  gcj02towgs84 // 向后兼容
} from './coordinateConverter';

export type { 
  CoordinatePoint,
} from './coordinateConverter';

export type {
  CoordinateSystem,
  Coordinate,
  ConversionOptions,
  ConversionResult,
  GeoBounds
} from './types';

export { CHINA_MAINLAND_BOUNDS } from './types';

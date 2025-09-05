/**
 * 坐标转换工具包
 * 
 * 提供中国常用坐标系之间的转换功能
 */

export { coordinateConverter } from './coordinateConverter';
export type { CoordinatePoint } from './coordinateConverter';

export type {
  CoordinateSystem,
  Coordinate,
  ConversionOptions,
  ConversionResult,
  GeoBounds,
} from './types';

export { CHINA_MAINLAND_BOUNDS } from './types';

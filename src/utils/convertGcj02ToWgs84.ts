/**
 * @fileoverview GCJ02 to WGS84 coordinate conversion utilities
 * @deprecated 此文件已重构，请使用 './coordinate' 模块中的新函数
 * 
 * 迁移指南：
 * - gcj02towgs84() -> convertGcj02ToWgs84() 
 * - 新增了更多功能和更好的类型支持
 */

// 重新导出新的坐标转换工具，保持向后兼容
export { 
  gcj02towgs84,
  convertGcj02ToWgs84,
  isInChinaMainland,
  batchConvertGcj02ToWgs84,
  type CoordinatePoint
} from './coordinate';

// 为了完全向后兼容，保留原函数签名的别名
import { gcj02towgs84 as newGcj02towgs84 } from './coordinate';

/**
 * @deprecated 请使用 convertGcj02ToWgs84 替代
 * 保持原有函数签名用于向后兼容
 */
export const gcj02towgs84Legacy = newGcj02towgs84;

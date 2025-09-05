/**
 * 坐标系转换工具
 * 
 * 支持中国常用坐标系之间的转换：
 * - GCJ02: 国家测绘局坐标系 (火星坐标系)
 * - WGS84: 世界大地测量系统坐标系 (GPS坐标系)
 */

// 地球椭球体参数常量
const EARTH_CONSTANTS = {
  /** 圆周率 */
  PI: 3.1415926535897932384626,
  /** 长半轴 (米) */
  SEMI_MAJOR_AXIS: 6378245.0,
  /** 第一偏心率的平方 */
  FIRST_ECCENTRICITY_SQUARED: 0.00669342162296594323,
} as const;

/**
 * 坐标转换结果类型
 */
export type CoordinatePoint = [longitude: number, latitude: number];

/**
 * 纬度转换计算
 * 
 * 基于克拉索夫斯基椭球体参数进行纬度偏移量计算
 * 
 * @param longitude - 经度
 * @param latitude - 纬度
 * @returns 转换后的纬度偏移量
 */
function calculateLatitudeTransform(longitude: number, latitude: number): number {
  const { PI } = EARTH_CONSTANTS;
  
  let result = -100.0 + 2.0 * longitude + 3.0 * latitude + 
               0.2 * latitude * latitude + 0.1 * longitude * latitude + 
               0.2 * Math.sqrt(Math.abs(longitude));
               
  result += (20.0 * Math.sin(6.0 * longitude * PI) + 20.0 * Math.sin(2.0 * longitude * PI)) * 2.0 / 3.0;
  result += (20.0 * Math.sin(latitude * PI) + 40.0 * Math.sin(latitude / 3.0 * PI)) * 2.0 / 3.0;
  result += (160.0 * Math.sin(latitude / 12.0 * PI) + 320 * Math.sin(latitude * PI / 30.0)) * 2.0 / 3.0;
  
  return result;
}

/**
 * 经度转换计算
 * 
 * 基于克拉索夫斯基椭球体参数进行经度偏移量计算
 * 
 * @param longitude - 经度
 * @param latitude - 纬度
 * @returns 转换后的经度偏移量
 */
function calculateLongitudeTransform(longitude: number, latitude: number): number {
  const { PI } = EARTH_CONSTANTS;
  
  let result = 300.0 + longitude + 2.0 * latitude + 
               0.1 * longitude * longitude + 0.1 * longitude * latitude + 
               0.1 * Math.sqrt(Math.abs(longitude));
               
  result += (20.0 * Math.sin(6.0 * longitude * PI) + 20.0 * Math.sin(2.0 * longitude * PI)) * 2.0 / 3.0;
  result += (20.0 * Math.sin(longitude * PI) + 40.0 * Math.sin(longitude / 3.0 * PI)) * 2.0 / 3.0;
  result += (150.0 * Math.sin(longitude / 12.0 * PI) + 300.0 * Math.sin(longitude / 30.0 * PI)) * 2.0 / 3.0;
  
  return result;
}

/**
 * 将GCJ02坐标系转换为WGS84坐标系
 * 
 * GCJ02是中国国家测绘局制定的地理信息系统的坐标系统，也被称为火星坐标系。
 * 中国大陆所有公开地理数据都需要至少用GCJ02进行加密。
 * 
 * WGS84是世界大地测量系统1984，是为GPS全球定位系统使用而建立的坐标系统。
 * 
 * @param longitude - GCJ02坐标系的经度
 * @param latitude - GCJ02坐标系的纬度
 * @returns [WGS84经度, WGS84纬度]
 * 
 * @example
 * ```typescript
 * // 转换北京天安门的坐标
 * const [wgs84Lng, wgs84Lat] = convertGcj02ToWgs84(116.397428, 39.90923);
 * console.log(`WGS84坐标: ${wgs84Lng}, ${wgs84Lat}`);
 * ```
 */
export function convertGcj02ToWgs84(longitude: number, latitude: number): CoordinatePoint {
  const { PI, SEMI_MAJOR_AXIS, FIRST_ECCENTRICITY_SQUARED } = EARTH_CONSTANTS;
  
  // 计算偏移量 (相对于中国大陆中心点 105°E, 35°N)
  const deltaLatitude = calculateLatitudeTransform(longitude - 105.0, latitude - 35.0);
  const deltaLongitude = calculateLongitudeTransform(longitude - 105.0, latitude - 35.0);
  
  // 将纬度转换为弧度
  const radianLatitude = latitude / 180.0 * PI;
  let magic = Math.sin(radianLatitude);
  magic = 1 - FIRST_ECCENTRICITY_SQUARED * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  
  // 计算最终偏移量
  const latitudeOffset = (deltaLatitude * 180.0) / ((SEMI_MAJOR_AXIS * (1 - FIRST_ECCENTRICITY_SQUARED)) / (magic * sqrtMagic) * PI);
  const longitudeOffset = (deltaLongitude * 180.0) / (SEMI_MAJOR_AXIS / sqrtMagic * Math.cos(radianLatitude) * PI);
  
  // 返回转换后的坐标
  const wgs84Longitude = longitude - longitudeOffset;
  const wgs84Latitude = latitude - latitudeOffset;
  
  return [wgs84Longitude, wgs84Latitude];
}

/**
 * 检查坐标是否在中国大陆范围内
 * 
 * 此函数用于判断给定坐标是否需要进行GCJ02加密
 * 
 * @param longitude - 经度
 * @param latitude - 纬度
 * @returns 是否在中国大陆范围内
 * 
 * @example
 * ```typescript
 * const inChina = isInChinaMainland(116.397428, 39.90923); // true (北京)
 * const notInChina = isInChinaMainland(139.6917, 35.6895); // false (东京)
 * ```
 */
export function isInChinaMainland(longitude: number, latitude: number): boolean {
  return longitude >= 72.004 && longitude <= 137.8347 && 
         latitude >= 0.8293 && latitude <= 55.8271;
}

/**
 * 批量坐标转换
 * 
 * @param coordinates - GCJ02坐标数组
 * @returns WGS84坐标数组
 * 
 * @example
 * ```typescript
 * const gcj02Points: CoordinatePoint[] = [
 *   [116.397428, 39.90923],  // 北京天安门
 *   [121.473701, 31.230416]  // 上海外滩
 * ];
 * const wgs84Points = batchConvertGcj02ToWgs84(gcj02Points);
 * ```
 */
export function batchConvertGcj02ToWgs84(coordinates: CoordinatePoint[]): CoordinatePoint[] {
  return coordinates.map(([lng, lat]) => convertGcj02ToWgs84(lng, lat));
}

/**
 * 向后兼容的函数别名
 * @deprecated 请使用 convertGcj02ToWgs84 替代
 */
export const gcj02towgs84 = convertGcj02ToWgs84;

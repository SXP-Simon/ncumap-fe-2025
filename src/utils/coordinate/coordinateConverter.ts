/**
 * coordinateConverter (清晰命名 + 详细注释)
 *
 * 提供将中国常用的 GCJ-02（火星坐标系）转换为 WGS-84（GPS 坐标）的工具。
 * 本文件侧重于可读性：常量、函数和局部变量使用可理解的全称命名，并添加参数/返回/示例注释。
 */

/** 表示一个经纬度点 [经度, 纬度]（单位：度） */
export type CoordinatePoint = [number, number];

// 常量说明
// PI: 圆周率
// semiMajorAxis: 椭球体长半轴（米），常用值 6378245.0 对应于中国测绘使用的基准
// eccentricitySquared: 第一偏心率的平方
const PI = Math.PI;
const semiMajorAxis = 6378245.0;
const eccentricitySquared = 0.00669342162296594323;

/**
 * 计算纬度方向的偏移量（与 transformLat 等价，但命名更语义化）
 * @param deltaLng 偏移的经度差（通常为 lng - 105.0）
 * @param deltaLat 偏移的纬度差（通常为 lat - 35.0）
 * @returns 纬度偏移量（单位：度的近似量，需要进一步按椭球体参数调整）
 */
function calculateLatitudeDelta(deltaLng: number, deltaLat: number): number {
  let value = -100.0 + 2.0 * deltaLng + 3.0 * deltaLat + 0.2 * deltaLat * deltaLat + 0.1 * deltaLng * deltaLat + 0.2 * Math.sqrt(Math.abs(deltaLng));
  value += (20.0 * Math.sin(6.0 * deltaLng * PI) + 20.0 * Math.sin(2.0 * deltaLng * PI)) * 2.0 / 3.0;
  value += (20.0 * Math.sin(deltaLat * PI) + 40.0 * Math.sin((deltaLat / 3.0) * PI)) * 2.0 / 3.0;
  value += (160.0 * Math.sin((deltaLat / 12.0) * PI) + 320.0 * Math.sin((deltaLat * PI) / 30.0)) * 2.0 / 3.0;
  return value;
}

/**
 * 计算经度方向的偏移量（与 transformLng 等价，但命名更语义化）
 * @param deltaLng 偏移的经度差（通常为 lng - 105.0）
 * @param deltaLat 偏移的纬度差（通常为 lat - 35.0）
 * @returns 经度偏移量（单位：度的近似量，需要进一步按椭球体参数调整）
 */
function calculateLongitudeDelta(deltaLng: number, deltaLat: number): number {
  let value = 300.0 + deltaLng + 2.0 * deltaLat + 0.1 * deltaLng * deltaLng + 0.1 * deltaLng * deltaLat + 0.1 * Math.sqrt(Math.abs(deltaLng));
  value += (20.0 * Math.sin(6.0 * deltaLng * PI) + 20.0 * Math.sin(2.0 * deltaLng * PI)) * 2.0 / 3.0;
  value += (20.0 * Math.sin(deltaLng * PI) + 40.0 * Math.sin((deltaLng / 3.0) * PI)) * 2.0 / 3.0;
  value += (150.0 * Math.sin((deltaLng / 12.0) * PI) + 300.0 * Math.sin((deltaLng / 30.0) * PI)) * 2.0 / 3.0;
  return value;
}

/**
 * 将单点 GCJ-02 坐标转换为 WGS-84 坐标
 *
 * 算法说明（简要）：
 * 1) 先根据相对中国基准点（经度 105，纬度 35）计算经验拟合的纬度/经度偏移量。
 * 2) 使用椭球体参数（长半轴和第一偏心率平方）将偏移量转换为真实角度偏移。
 * 3) 原 GCJ-02 坐标减去偏移量即为近似的 WGS-84 坐标。
 *
 * @param longitudeGCJ 经度（GCJ-02，单位：度）
 * @param latitudeGCJ 纬度（GCJ-02，单位：度）
 * @returns [longitudeWGS84, latitudeWGS84]
 *
 * @example
 * const [lng, lat] = coordinateConverter.convertGcj02ToWgs84(116.397428, 39.90923);
 */
function convertGcj02ToWgs84(longitudeGCJ: number, latitudeGCJ: number): CoordinatePoint {
  // 以 (105, 35) 作为经验基准计算偏移
  const deltaLatRaw = calculateLatitudeDelta(longitudeGCJ - 105.0, latitudeGCJ - 35.0);
  const deltaLngRaw = calculateLongitudeDelta(longitudeGCJ - 105.0, latitudeGCJ - 35.0);

  // 纬度转弧度
  const radianLatitude = (latitudeGCJ / 180.0) * PI;

  // 根据椭球体参数调整偏移
  const sinLat = Math.sin(radianLatitude);
  const magic = 1 - eccentricitySquared * sinLat * sinLat; // 临时变量，用于计算曲率
  const sqrtMagic = Math.sqrt(magic);

  const latitudeOffset = (deltaLatRaw * 180.0) / ((semiMajorAxis * (1 - eccentricitySquared)) / (magic * sqrtMagic) * PI);
  const longitudeOffset = (deltaLngRaw * 180.0) / ((semiMajorAxis / sqrtMagic) * Math.cos(radianLatitude) * PI);

  const longitudeWGS84 = longitudeGCJ - longitudeOffset;
  const latitudeWGS84 = latitudeGCJ - latitudeOffset;

  return [longitudeWGS84, latitudeWGS84];
}

/**
 * 批量将一组 GCJ-02 点转换为 WGS-84
 * @param points GCJ-02 点数组（元素为 [经度, 纬度]）
 * @returns WGS-84 点数组
 */
function batchConvertGcj02ToWgs84(points: CoordinatePoint[]): CoordinatePoint[] {
  return points.map(([lng, lat]) => convertGcj02ToWgs84(lng, lat));
}

/**
 * 判断坐标是否位于中国大陆范围内（含近海带）
 */
function isInChinaMainland(longitude: number, latitude: number): boolean {
  return longitude >= 72.004 && longitude <= 137.8347 && latitude >= 0.8293 && latitude <= 55.8271;
}

/**
 * 导出统一工具对象
 */
export const coordinateConverter = {
  convertGcj02ToWgs84,
  batchConvertGcj02ToWgs84,
  isInChinaMainland,
};

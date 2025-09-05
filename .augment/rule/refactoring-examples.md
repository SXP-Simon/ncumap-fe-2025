# 代码重构示例

## 1. 坐标转换工具重构

### 原代码 (gcj02towgs84.ts)
```typescript
// 意义不明的命名，缺少注释
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

function transformlat(lng: number, lat: number): number {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    // ... 复杂计算逻辑
    return ret;
}

export function gcj02towgs84(lng: number, lat: number): [number, number] {
    // ... 转换逻辑
}
```

### 重构后代码 (src/utils/coordinate/coordinateConverter.ts)
```typescript
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
  
  // 计算偏移量
  const deltaLatitude = calculateLatitudeTransform(longitude - 105.0, latitude - 35.0);
  const deltaLongitude = calculateLongitudeTransform(longitude - 105.0, latitude - 35.0);
  
  // 计算弧度
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
 * @param longitude - 经度
 * @param latitude - 纬度
 * @returns 是否在中国大陆范围内
 */
export function isInChinaMainland(longitude: number, latitude: number): boolean {
  return longitude >= 72.004 && longitude <= 137.8347 && 
         latitude >= 0.8293 && latitude <= 55.8271;
}
```

## 2. 地图组件重构

### 原代码结构问题
- 单一组件承担过多职责
- 状态管理混乱
- 缺少类型定义
- 命名不规范

### 重构后的组件结构

#### 主容器组件 (src/components/map/MapContainer.tsx)
```typescript
/**
 * 地图容器组件
 * 
 * 职责：
 * - 地图的初始化和基础配置
 * - 地图视图的管理 (缩放、平移)
 * - 子组件的协调和通信
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Map, View } from 'ol';
import { useMapInitialization } from '../../hooks/useMapInitialization';
import { useMapInteraction } from '../../hooks/useMapInteraction';
import { MapMarkerLayer } from './MapMarkerLayer';
import { MapTileLayer } from './MapTileLayer';
import { IMapContainerProps, IMapContainerRef } from '../../types/map.types';

/**
 * 地图容器组件
 */
const MapContainer = forwardRef<IMapContainerRef, IMapContainerProps>(
  ({ centerCoordinate, initialZoom = 3, onFeatureSelected }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    
    // 使用自定义Hook管理地图初始化
    const { mapInstance, viewInstance } = useMapInitialization({
      target: mapRef.current,
      center: centerCoordinate,
      zoom: initialZoom,
    });
    
    // 使用自定义Hook管理地图交互
    const { handleFeatureClick } = useMapInteraction({
      map: mapInstance,
      onFeatureSelected,
    });
    
    // 暴露组件方法给父组件
    useImperativeHandle(ref, () => ({
      /**
       * 移动地图视图到指定坐标
       */
      moveToCoordinate: (coordinate: [number, number]) => {
        viewInstance?.setCenter(coordinate);
      },
      
      /**
       * 设置地图缩放级别
       */
      setZoomLevel: (zoom: number) => {
        viewInstance?.setZoom(zoom);
      },
      
      /**
       * 获取当前地图中心点
       */
      getCurrentCenter: () => {
        return viewInstance?.getCenter() || [0, 0];
      },
    }));
    
    return (
      <div 
        ref={mapRef} 
        className="map-container"
        style={{ width: '100%', height: '100%' }}
      >
        {mapInstance && (
          <>
            <MapTileLayer map={mapInstance} />
            <MapMarkerLayer 
              map={mapInstance} 
              onMarkerClick={handleFeatureClick}
            />
          </>
        )}
      </div>
    );
  }
);

MapContainer.displayName = 'MapContainer';

export default MapContainer;
```

#### 地图标记层组件 (src/components/map/MapMarkerLayer.tsx)
```typescript
/**
 * 地图标记层组件
 * 
 * 职责：
 * - 管理地图标记的显示和隐藏
 * - 处理标记的样式和交互
 * - 根据缩放级别动态加载标记
 */

import React, { useEffect } from 'react';
import { Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import { IMapMarkerLayerProps } from '../../types/map.types';

/**
 * 地图标记层组件
 */
export const MapMarkerLayer: React.FC<IMapMarkerLayerProps> = ({ 
  map, 
  onMarkerClick 
}) => {
  // 使用自定义Hook管理标记数据和状态
  const { 
    markers, 
    vectorSource, 
    isLoading, 
    error,
    refreshMarkers 
  } = useMapMarkers();
  
  useEffect(() => {
    if (!map || !vectorSource) return;
    
    // 创建矢量图层
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      className: 'marker-layer',
    });
    
    // 添加图层到地图
    map.addLayer(vectorLayer);
    
    // 组件卸载时清理图层
    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, vectorSource]);
  
  // 处理标记点击事件
  useEffect(() => {
    if (!map || !onMarkerClick) return;
    
    const handleClick = (event: any) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature && feature.get('type') === 'marker') {
        onMarkerClick(feature.get('locationId'));
      }
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.un('click', handleClick);
    };
  }, [map, onMarkerClick]);
  
  // 错误处理
  if (error) {
    console.error('[MapMarkerLayer] 标记加载失败:', error);
  }
  
  return null; // 这个组件不渲染DOM，只管理地图图层
};
```

## 3. 自定义Hook重构

### useMapMarkers Hook
```typescript
/**
 * 地图标记管理Hook
 * 
 * 功能：
 * - 获取和管理地图标记数据
 * - 创建和更新标记要素
 * - 处理标记的显示逻辑
 */

import { useState, useEffect, useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { mapService } from '../../services/mapService';
import { convertGcj02ToWgs84 } from '../../utils/coordinate/coordinateConverter';
import { IMapMarker } from '../../types/map.types';
import { ErrorHandler } from '../../utils/common/errorHandler';

/**
 * 地图标记管理Hook的返回类型
 */
interface UseMapMarkersReturn {
  /** 标记数据列表 */
  markers: IMapMarker[];
  /** 矢量数据源 */
  vectorSource: VectorSource | null;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新标记数据 */
  refreshMarkers: () => Promise<void>;
}

/**
 * 地图标记管理Hook
 */
export function useMapMarkers(): UseMapMarkersReturn {
  const [markers, setMarkers] = useState<IMapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  
  /**
   * 创建标记要素
   */
  const createMarkerFeature = (marker: IMapMarker): Feature => {
    // 转换坐标系
    const [longitude, latitude] = convertGcj02ToWgs84(
      marker.coordinates[0], 
      marker.coordinates[1]
    );
    
    // 创建点要素
    const feature = new Feature({
      geometry: new Point([longitude, latitude]),
      type: 'marker',
      locationId: marker.locationId,
      name: marker.name,
      category: marker.category,
    });
    
    // 设置标记样式
    feature.setStyle(new Style({
      image: new Icon({
        src: `/images/marks/${marker.category}/${marker.locationId}.svg`,
        scale: 1.3,
        anchor: [0.2, 1],
      }),
    }));
    
    return feature;
  };
  
  /**
   * 更新标记显示
   */
  const updateMarkers = (newMarkers: IMapMarker[]) => {
    const vectorSource = vectorSourceRef.current;
    
    // 清除现有标记
    vectorSource.clear();
    
    // 添加新标记
    const features = newMarkers.map(createMarkerFeature);
    vectorSource.addFeatures(features);
    
    setMarkers(newMarkers);
  };
  
  /**
   * 获取标记数据
   */
  const fetchMarkers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const markersData = await mapService.getMapMarkers();
      updateMarkers(markersData);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取标记数据失败');
      setError(error);
      ErrorHandler.handleApiError(error, '获取地图标记');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件挂载时获取数据
  useEffect(() => {
    fetchMarkers();
  }, []);
  
  return {
    markers,
    vectorSource: vectorSourceRef.current,
    isLoading,
    error,
    refreshMarkers: fetchMarkers,
  };
}
```

这些重构示例展示了如何将原有的Vue代码转换为高质量的React代码，包括：
1. 清晰的职责分离
2. 详细的中文注释
3. 规范的命名约定
4. 完整的类型定义
5. 错误处理机制
6. 可复用的Hook设计

import type { MapActions, MapData, MapMark } from './types';
import type { OpenMapRef } from '../components/OpenMap';

/**
 * 地图操作相关的 hook
 * 提供地图的基本操作方法
 */
export function useMapActions(
  setMap: any,
  updateFromRef: any,
  getCurrentMarks: any,
  mapRef: React.RefObject<OpenMapRef | null>,
  map: MapData
): MapActions {
  
  // 只跳转到地图位置，不进入详情页
  const mapViewToLocation = (locationId: string) => {
    if (!mapRef.current || !map.marks) return;
    
    // 查找指定的位置
    let targetMark: MapMark | null = null;
    for (const category of Object.keys(map.marks)) {
      const mark = map.marks[category].find(mark => 
        mark.location_id === locationId || 
        String(mark.id) === locationId || 
        mark.locationId === locationId
      );
      if (mark) {
        targetMark = mark;
        break;
      }
    }
    
    if (targetMark && targetMark.coordinates) {
      mapRef.current.viewTo(targetMark.coordinates);
      const markZoom = targetMark.priority ?? 3;
      mapRef.current.zoomTo(3 > markZoom ? 3 : markZoom);
    }
  };

  return {
    setMap,
    updateFromRef,
    getCurrentMarks,
    mapViewToLocation,
  };
}

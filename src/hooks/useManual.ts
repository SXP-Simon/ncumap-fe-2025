import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OpenMapRef } from '../components/OpenMap';
import type { ManualData } from './types';

export function useManual(mapRef: React.RefObject<OpenMapRef | null>, manualData: ManualData | null) {
  const navigate = useNavigate();
  const [manualGroupIndex, setManualGroupIndex] = useState<number>(-1);
  const [manualSelectedIndex, setManualSelectedIndex] = useState<number>(-1);

  const manualSelect = (itemIndex: number, groupIndex: number) => {
    // 更新选择状态
    setManualSelectedIndex(itemIndex);
    setManualGroupIndex(groupIndex);
    
    // 只跳转到地图位置，不进入详情页
    const keys = Object.keys(manualData || {});
    const key = keys[groupIndex];
    const current = manualData && manualData[key] && manualData[key][itemIndex];
    if (mapRef.current && current) {
      if (current.coordinates) mapRef.current.viewTo(current.coordinates);
  const markZoom = current.priority ?? 3;
  mapRef.current.zoomTo(Math.max(3, markZoom));
    }
  };

  const manualRedirect = () => {
    // 使用当前最新的选择进行跳转到详情页
    if (manualData && manualGroupIndex >= 0 && manualSelectedIndex >= 0) {
      const categoryKeys = Object.keys(manualData);
      const key = categoryKeys[manualGroupIndex];
      const current = manualData[key] && manualData[key][manualSelectedIndex];
      if (current && (current.location_id || current.locationId || current.id)) {
        // 重置选择状态，避免状态污染
        setManualGroupIndex(-1);
        setManualSelectedIndex(-1);
        navigate(`/${current.location_id ?? current.locationId ?? current.id}`);
      }
    }
  };

  // 只跳转到地图位置的函数（不进入详情页）
  const manualSelectOnly = (itemIndex: number, groupIndex: number) => {
    const keys = Object.keys(manualData || {});
    const key = keys[groupIndex];
    const current = manualData && manualData[key] && manualData[key][itemIndex];
    
    if (current && mapRef.current) {
      // 只跳转到地图位置
      if (current.coordinates) mapRef.current.viewTo(current.coordinates);
  const markZoom = current.priority ?? 3;
  mapRef.current.zoomTo(Math.max(3, markZoom));
    }
  };

  return {
    manualGroupIndex,
    manualSelectedIndex,
    manualSelect,
    manualRedirect,
    manualSelectOnly,
  };
}

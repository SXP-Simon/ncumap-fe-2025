import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OpenMapRef } from '../components/OpenMap';
import type { ManualData } from './types';

export function useManual(mapRef: React.RefObject<OpenMapRef | null>, manualData: ManualData | null) {
  const navigate = useNavigate();
  const [manualGroupIndex, setManualGroupIndex] = useState<number>(-1);
  const [manualSelectedIndex, setManualSelectedIndex] = useState<number>(-1);

  const manualSelect = (itemIndex: number, groupIndex: number) => {
    setManualSelectedIndex(itemIndex);
    setManualGroupIndex(groupIndex);
    const keys = Object.keys(manualData || {});
    const key = keys[groupIndex];
    const current = manualData && manualData[key] && manualData[key][itemIndex];
    if (mapRef.current && current) {
      if (current.coordinates) mapRef.current.viewTo(current.coordinates);
      const markZoom = current.priority ?? 3;
      mapRef.current.zoomTo(3 > markZoom ? 3 : markZoom);
    }
  };

  const manualRedirect = () => {
    if (manualData && manualGroupIndex >= 0 && manualSelectedIndex >= 0) {
      const categoryKeys = Object.keys(manualData);
      const key = categoryKeys[manualGroupIndex];
      const current = manualData[key] && manualData[key][manualSelectedIndex];
      if (current && (current.location_id || current.locationId || current.id)) {
        navigate(`/${current.location_id ?? current.locationId ?? current.id}`);
      }
    }
  };

  return {
    manualGroupIndex,
    manualSelectedIndex,
    manualSelect,
    manualRedirect,
  };
}

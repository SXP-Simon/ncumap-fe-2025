import { useState, useCallback } from 'react';
import type { OpenMapRef } from '../components/OpenMap';
import type { MapData, MapMark } from './types';

export function useMapState(mapRef: React.RefObject<OpenMapRef | null>) {
  const [map, setMap] = useState<MapData>({
    currentCategory: 0,
    categories: ['全部', '活动'],
    marks: null,
  });

  const updateFromRef = useCallback(() => {
    if (mapRef.current) {
      setMap(prev => ({ ...prev, categories: mapRef.current!.categories, marks: mapRef.current!.marks }));
    }
  }, [mapRef]);

  const getCurrentMarks = (): MapMark[] => {
    if (!map.marks || !map.categories[map.currentCategory]) return [];
    
    const categoryName = map.categories[map.currentCategory];
    const marks = map.marks[categoryName] || [];
    return marks;
  };

  return { map, setMap, updateFromRef, getCurrentMarks };
}

import { useState } from 'react';
import type { OpenMapRef } from '../components/OpenMap';

export interface MapData {
  currentCategory: number;
  categories: string[];
  marks: any;
}

export function useMapState(mapRef: React.RefObject<OpenMapRef | null>) {
  const [map, setMap] = useState<MapData>({
    currentCategory: 0,
    categories: ['全部', '活动'],
    marks: null,
  });

  const updateFromRef = () => {
    if (mapRef.current) {
      setMap(prev => ({ ...prev, categories: mapRef.current!.categories, marks: mapRef.current!.marks }));
    }
  };

  const getCurrentMarks = () => {
    if (!map.marks || !map.categories[map.currentCategory]) return [];
    return map.marks[map.categories[map.currentCategory]] || [];
  };

  return { map, setMap, updateFromRef, getCurrentMarks };
}

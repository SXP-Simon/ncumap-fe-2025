import React from 'react';

interface MapMarkProps {
  coordinates: number[];
  name: string;
  category: string;
  id: string;
}

const MapMark: React.FC<MapMarkProps> = ({ coordinates, name, category, id }) => {
  // 这个组件主要用于类型定义，实际的标记渲染在OpenMap组件中处理
  return null;
};

export default MapMark;

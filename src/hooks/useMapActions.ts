import type { MapActions } from './types';

/**
 * 地图操作相关的 hook
 * 提供地图的基本操作方法
 */
export function useMapActions(
  setMap: any,
  updateFromRef: any,
  getCurrentMarks: any
): MapActions {
  return {
    setMap,
    updateFromRef,
    getCurrentMarks,
  };
}

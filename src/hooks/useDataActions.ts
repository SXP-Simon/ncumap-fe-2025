import { useActivities } from './useActivities';
import type { DataActions, ActivitiesData, MapMarks } from './types';

/**
 * 数据操作相关的 hook
 * 处理数据的获取、转换和访问
 */
export function useDataActions(activitiesData: ActivitiesData | null, mapMarks: MapMarks | null): DataActions {
  const activitiesList = useActivities(activitiesData, mapMarks);

  const getActivitiesList = () => activitiesList;

  return {
    getActivitiesList,
  };
}

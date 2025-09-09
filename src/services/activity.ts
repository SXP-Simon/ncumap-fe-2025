import { fetcher, baseURL } from './api';
import type { ActivitiesData } from '@/hooks/types';

/**
 * 获取所有活动数据
 */
export const getAllActivities = () => {
  return fetcher.get<ActivitiesData>(`${baseURL}/api/v1/activity/all`);
};

/**
 * 获取校园活动数据
 */
export const getCampusActivities = () => {
  return fetcher.get<ActivitiesData>(`${baseURL}/api/v1/campus/activities`);
};

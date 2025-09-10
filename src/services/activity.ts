import { fetcher, baseURL } from './api';
import type { ActivitiesData } from '@/types/activity';

/**
 * 获取所有活动数据
 */
export const getAllActivities = () => {
  return fetcher.get<ActivitiesData>(`${baseURL}/api/v1/activity/all`);
};

/**
 * 获取特定活动详情
 */
export const getActivityById = (id: string) => {
  return fetcher.get(`${baseURL}/api/v1/activity/id`, {
    params: { id }
  });
};

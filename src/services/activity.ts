import { fetcher, baseURL } from './api';
import type { ActivityItem } from '@/types/activity';

/**
 * 获取所有活动数据
 */
export const getAllActivities = () => {
  // 后端返回的是活动数组，使用 ActivityItem[] 以便获取正确的类型提示
  return fetcher.get<ActivityItem[]>(`${baseURL}/api/v1/activity/all`);
};

/**
 * 获取特定活动详情
 */
export const getActivityById = (id: string) => {
  return fetcher.get<ActivityItem>(`${baseURL}/api/v1/activity/id`, {
    params: { id },
  });
};

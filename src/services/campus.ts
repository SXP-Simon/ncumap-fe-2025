import { fetcher, baseURL } from './api';
import type { MapMarks } from '@/types/map';

/**
 * 获取校园地点标记数据
 */
export const getCampusMarks = () => {
  return fetcher.get<MapMarks>(`${baseURL}/api/v1/campus/marks`);
};

/**
 * 根据地点ID获取详细信息
 */
export const getLocationById = (locationId: string) => {
  return fetcher.get(`${baseURL}/api/v1/campus/locations/id`, {
    params: { location_id: locationId }
  });
};

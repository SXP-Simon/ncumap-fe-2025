import { fetcher, baseURL } from './api';
import type { ManualData } from '@/types/manual';

/**
 * 获取新生手册数据
 */
export const getFreshmenManual = () => {
  return fetcher.get<ManualData>(`${baseURL}/api/v1/freshmen/manual`);
};

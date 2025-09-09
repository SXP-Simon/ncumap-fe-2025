import { fetcher, baseURL } from './api';
import type { ManualData } from '@/hooks/types';

/**
 * 获取新生手册数据
 */
export const getFreshmenManual = () => {
  return fetcher.get<ManualData>(`${baseURL}/api/v1/freshmen/manual`);
};

/**
 * 获取校园手册数据
 */
export const getCampusManual = () => {
  return fetcher.get<ManualData>(`${baseURL}/api/v1/campus/manual`);
};

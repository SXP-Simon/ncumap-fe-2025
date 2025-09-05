import axios from 'axios';
import { mincu } from 'mincu-vanilla';

export const fetcher = axios.create();
mincu.useAxiosInterceptors(fetcher);

export const baseURL = 'https://ncumap-be.ncuos.com';

// 本地数据备用方案
export const fetchLocalData = async (path: string) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch local data:', error);
    throw error;
  }
};

export default fetcher;

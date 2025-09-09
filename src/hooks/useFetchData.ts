import { useState, useEffect } from 'react';
import { fetchLocalData } from '@/services/api';
import { getFreshmenManual } from '@/services/manual';
import { getAllActivities } from '@/services/activity';
import { getCampusMarks } from '@/services/campus';
import type { ManualData, ActivitiesData, MapMarks } from './types';

// 初始数据
const INITIAL_MANUAL_DATA: ManualData = {
  "基本职能": [],
  "其他": []
};

const INITIAL_ACTIVITIES_DATA: ActivitiesData = {
  activities: []
};

interface FetchDataState {
  manualData: ManualData | null;
  activitiesData: ActivitiesData | null;
  campusMarks: MapMarks | null;
}

interface UseFetchDataResult extends FetchDataState {
  isLoading: boolean;
  error: Error | null;
}

/**
 * 从本地加载校园地图数据的备用方案
 */
const loadLocalMapData = async (): Promise<MapMarks | null> => {
  try {
    return await fetchLocalData('/data.json');
  } catch (err) {
    console.warn('Failed to load local campus marks:', err);
    return null;
  }
};

/**
 * 从 API 加载所有数据
 */
const fetchAllData = async (): Promise<FetchDataState> => {
  const [manualResponse, activitiesResponse, marksResponse] = await Promise.all([
    getFreshmenManual(),
    getAllActivities(),
    getCampusMarks()
  ]);

  return {
    manualData: manualResponse.data,
    activitiesData: activitiesResponse.data,
    campusMarks: marksResponse.data
  };
};

/**
 * 获取校园数据的 Hook
 * 
 * 优先从 API 获取数据，如果失败则：
 * 1. 手册数据使用空数据
 * 2. 活动数据使用空数据
 * 3. 地图数据尝试从本地加载，如果本地加载也失败则返回 null
 */
export function useFetchData(): UseFetchDataResult {
  const [state, setState] = useState<FetchDataState>({
    manualData: null,
    activitiesData: null,
    campusMarks: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // 尝试从 API 获取数据
        const data = await fetchAllData();
        if (!mounted) return;
        
        setState(data);
        setError(null);
      } catch (apiError) {
        console.warn('API failed, using mock data or local data:', apiError);
        if (!mounted) return;

        // 备用方案：使用本地数据或简单 mock
        setState({
          manualData: INITIAL_MANUAL_DATA,
          activitiesData: INITIAL_ACTIVITIES_DATA,
          campusMarks: await loadLocalMapData()
        });
        
        setError(apiError instanceof Error ? apiError : new Error('Failed to fetch data'));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    init();
    return () => { mounted = false; };
  }, []);

  return { ...state, isLoading, error };
}
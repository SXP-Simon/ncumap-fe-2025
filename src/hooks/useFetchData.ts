import { useState, useEffect } from 'react';
import fetcher, { baseURL } from './fetcher';
import type { ManualData, ActivitiesData } from './types';

export function useFetchData() {
  const [manualData, setManualData] = useState<ManualData | null>(null);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        try {
          // 尝试从 API 获取数据
          const manualResponse = await fetcher.get(baseURL + '/api/v1/freshmen/manual');
          const activitiesResponse = await fetcher.get(baseURL + '/api/v1/activity/all');
          if (!mounted) return;
          setManualData(manualResponse.data);
          setActivitiesData(activitiesResponse.data);
        } catch (apiError) {
          console.warn('API failed, using mock data:', apiError);
          // 备用方案：使用模拟数据
          if (!mounted) return;
          setManualData({
            "基本职能": [],
            "其他": []
          });
          setActivitiesData({
            activities: []
          });
        }
      } catch (e) {
        console.error('fetch data failed', e);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  return { manualData, activitiesData };
}

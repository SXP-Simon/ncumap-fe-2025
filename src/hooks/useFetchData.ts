import { useState, useEffect } from 'react';
import fetcher, { baseURL, fetchLocalData } from '@/services/api';
import type { ManualData, ActivitiesData } from './types';
import type { MapMarks } from './types';

export function useFetchData() {
  const [manualData, setManualData] = useState<ManualData | null>(null);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [campusMarks, setCampusMarks] = useState<MapMarks | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        try {
          // 尝试从 API 获取数据
          const [manualResponse, activitiesResponse, marksResponse] = await Promise.all([
            fetcher.get(baseURL + '/api/v1/freshmen/manual'),
            fetcher.get(baseURL + '/api/v1/activity/all'),
            fetcher.get(baseURL + '/api/v1/campus/marks')
          ]);
          if (!mounted) return;
          setManualData(manualResponse.data);
          setActivitiesData(activitiesResponse.data);
          setCampusMarks(marksResponse.data);
        } catch (apiError) {
          console.warn('API failed, using mock data or local data:', apiError);
          // 备用方案：使用本地数据或简单 mock
          if (!mounted) return;
          setManualData({
            "基本职能": [],
            "其他": []
          });
          setActivitiesData({
            activities: []
          });
          try {
            const local = await fetchLocalData('/data.json');
            setCampusMarks(local);
          } catch (localErr) {
            console.warn('Failed to load local campus marks:', localErr);
            setCampusMarks(null);
          }
        }
      } catch (e) {
        console.error('fetch data failed', e);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  return { manualData, activitiesData, campusMarks };
}

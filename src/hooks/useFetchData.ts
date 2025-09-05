import { useState, useEffect } from 'react';
import fetcher, { baseURL } from './fetcher';

export function useFetchData() {
  const [manualData, setManualData] = useState<any>(null);
  const [activitiesData, setActivitiesData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const manualResponse = await fetcher.get(baseURL + '/api/v1/freshmen/manual');
        const activitiesResponse = await fetcher.get(baseURL + '/api/v1/activity/all');
        if (!mounted) return;
        setManualData(manualResponse.data);
        setActivitiesData(activitiesResponse.data);
      } catch (e) {
        console.error('fetch data failed', e);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  return { manualData, activitiesData };
}

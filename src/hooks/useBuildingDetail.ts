import { useState, useEffect } from 'react';
import { fetcher, baseURL } from './fetcher';

export interface BuildingDetail {
  id: string;
  name: string;
  info: string;
  cover?: string;
  functions?: string[];
  offices?: string[];
  activities?: string[];
  imgs?: string[];
  tips: {
    info?: Array<{
      title: string;
      content: string[];
    }>;
    functions?: Array<{
      title: string;
      content: string[];
    }>;
    offices?: Array<{
      title: string;
      content: string[];
    }>;
    activities?: Array<{
      title: string;
      content: string[];
    }>;
  };
}

export const useBuildingDetail = (locationId: string | undefined) => {
  const [building, setBuilding] = useState<BuildingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) return;

    let mounted = true;
    
    const fetchBuildingDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetcher.get(
          `${baseURL}/api/v1/campus/locations/id?location_id=${locationId}`
        );
        
        if (mounted) {
          setBuilding(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : '获取建筑详情失败');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBuildingDetail();

    return () => {
      mounted = false;
    };
  }, [locationId]);

  return { building, loading, error };
};

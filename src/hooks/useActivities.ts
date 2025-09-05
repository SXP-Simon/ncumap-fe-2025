import { useMemo } from 'react';
import type { ActivitiesData, MapMarks, ActivityListItem, ActivityItem, MapMark } from './types';

export function useActivities(activitiesData: ActivitiesData | null, marks: MapMarks | null): ActivityListItem[] {
  const list = useMemo(() => {
    const out: ActivityListItem[] = [];
    
    if (activitiesData) {
      if (Array.isArray(activitiesData)) {
        (activitiesData as ActivityItem[]).forEach((it) => {
          out.push({
            title: it.title || it.name || it.description || it.content || String(it),
            location_id: it.location_id ?? it.locationId ?? it.location ?? null,
            raw: it
          });
        });
        return out;
      }

      if (activitiesData.activities && Array.isArray(activitiesData.activities)) {
        activitiesData.activities.forEach((it) => {
          out.push({ 
            title: it.title || String(it), 
            location_id: it.location_id ?? null, 
            raw: it 
          });
        });
        return out;
      }
    }

    if (marks) {
      try {
        const keys = Object.keys(marks);
        keys.forEach((k) => {
          const arr = marks[k] || [];
          arr.forEach((mark: MapMark) => {
            if (mark.activities && Array.isArray(mark.activities) && mark.activities.length > 0) {
              mark.activities.forEach((act) => {
                out.push({ 
                  title: act, 
                  location_id: mark.location_id ?? String(mark.id) ?? null, 
                  name: mark.name, 
                  raw: mark 
                });
              });
            }
          });
        });
      } catch (e) {
        // ignore
      }
    }

    return out;
  }, [activitiesData, marks]);

  return list;
}

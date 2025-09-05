import { useMemo } from 'react';

export function useActivities(activitiesData: any, marks: any) {
  const list = useMemo(() => {
    const out: any[] = [];
    if (activitiesData) {
      if (Array.isArray(activitiesData)) {
        activitiesData.forEach((it: any) => {
          out.push({
            title: it.title || it.name || it.description || it.content || String(it),
            location_id: it.location_id ?? it.locationId ?? it.location ?? null,
            raw: it
          });
        });
        return out;
      }

      if (activitiesData.activities && Array.isArray(activitiesData.activities)) {
        activitiesData.activities.forEach((it: any) => {
          out.push({ title: it.title || it, location_id: it.location_id ?? null, raw: it });
        });
        return out;
      }
    }

    if (marks) {
      try {
        const keys = Object.keys(marks);
        keys.forEach((k) => {
          const arr = marks[k] || [];
          arr.forEach((mark: any) => {
            if (mark.activities && Array.isArray(mark.activities) && mark.activities.length > 0) {
              mark.activities.forEach((act: any) => {
                out.push({ title: act, location_id: mark.location_id ?? mark.id ?? null, name: mark.name, raw: mark });
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

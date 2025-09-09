import { useMemo } from 'react';
import type { ActivitiesData, MapMarks, ActivityItem, MapMark, ActivityUIItem } from './types';

/**
 * 返回扁平化的活动列表，项结构与 Index 所需字段兼容：
 * { id, name, info, coordinates, priority, functions, location_id, raw }
 */
export function useActivities(activitiesData: ActivitiesData | null, marks: MapMarks | null): ActivityUIItem[] {
  const list = useMemo(() => {
  const out: ActivityUIItem[] = [];

    if (activitiesData) {
      if (Array.isArray(activitiesData)) {
        (activitiesData as ActivityItem[]).forEach((it, idx) => {
          const locId = it.location_id ?? it.locationId ?? it.location ?? String(it.id ?? idx);
          const item: ActivityUIItem = {
            id: locId,
            title: it.title || it.name || it.description || it.content || '未命名活动',
            location_id: locId,
            raw: it,
            name: it.title || it.name || it.description || it.content || '未命名活动',
            coordinates: it.coordinates ?? [0, 0],
            priority: it.priority ?? 0,
            info: it.info ?? it.description ?? '',
            functions: ['活动'],
          };
          out.push(item);
        });
        return out;
      }

      if (activitiesData.activities && Array.isArray(activitiesData.activities)) {
        activitiesData.activities.forEach((it, idx) => {
          const locId = it.location_id ?? String(idx);
          const item: ActivityUIItem = {
            id: locId,
            title: it.title || String(it) || '未命名活动',
            location_id: locId,
            raw: it,
            name: it.title || String(it) || '未命名活动',
            coordinates: it.coordinates ?? [0, 0],
            priority: it.priority ?? 0,
            info: it.info ?? '',
            functions: ['活动'],
          };
          out.push(item);
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
              mark.activities.forEach((act, idx) => {
                const locId = mark.location_id ?? String(mark.id ?? `${k}-${idx}`);
                const item: ActivityUIItem = {
                  id: locId,
                  title: String(act) || '未命名活动',
                  location_id: locId,
                  raw: mark,
                  name: String(act) || mark.name || '未命名活动',
                  coordinates: mark.coordinates ?? [0, 0],
                  priority: mark.priority ?? 0,
                  info: mark.name ?? '',
                  functions: ['活动'],
                };
                out.push(item);
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

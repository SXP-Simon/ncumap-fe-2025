import type { MapMark } from '@/types/map';
import type { ManualListItem } from '@/types/manual';
import type { ActivityUIItem, UIListItem } from '@/types/activity';

/**
 * 返回稳定的 location id（string）
 * 优先级：Manual.location_id -> Activity.id -> MapMark.locationId -> fallbackIndex
 */
export function resolveLocationId(item?: UIListItem, fallbackIndex?: number): string {
  if (!item) return String(fallbackIndex ?? '');

  if ((item as ManualListItem).location_id) {
    return String((item as ManualListItem).location_id);
  }

  if ((item as ActivityUIItem).id != null) {
    return String((item as ActivityUIItem).id);
  }

  if ((item as MapMark).locationId) {
    return String((item as MapMark).locationId);
  }

  return String(fallbackIndex ?? '');
}

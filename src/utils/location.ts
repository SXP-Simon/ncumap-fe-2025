/**
 * 返回稳定的 location id（string）
 * 兼容以下数据类型：
 * - API 返回的地点/活动对象（包含 location_id 或 id 字段）
 * - 直接传入字符串/数字 ID
 * - 手册数据扁平化后的对象
 */
export function resolveLocationId(
  item?: unknown,
  fallbackIndex?: number
): string {
  if (item == null) {
    return String(fallbackIndex ?? '');
  }

  if (typeof item === 'string' || typeof item === 'number') {
    return String(item);
  }

  if (typeof item === 'object') {
    const record = item as Record<string, unknown>;

    if (record.location_id != null) {
      return String(record.location_id);
    }

    if (record.id != null) {
      return String(record.id);
    }
  }

  return String(fallbackIndex ?? '');
}

import type { SensorReading } from '@/domain/types';

/** Default: a reading older than 6 hours is treated as stale for dashboard use. */
export const DEFAULT_STALE_AFTER_MS = 6 * 60 * 60 * 1000;

export function isReadingStale(
  reading: Pick<SensorReading, 'measuredAt' | 'value' | 'quality'>,
  nowMs: number,
  staleAfterMs: number = DEFAULT_STALE_AFTER_MS
): boolean {
  if (reading.value === null || reading.quality === 'missing') {
    return false;
  }

  if (reading.quality === 'stale') {
    return true;
  }

  const measuredMs = Date.parse(reading.measuredAt);
  if (Number.isNaN(measuredMs)) {
    return true;
  }

  return nowMs - measuredMs > staleAfterMs;
}

export function latestReadingForMetric(
  readings: SensorReading[],
  greenhouseId: string,
  metricCode: SensorReading['metricCode'],
  zoneId: string | null = null
): SensorReading | null {
  const matches = readings.filter(
    (reading) =>
      reading.greenhouseId === greenhouseId &&
      reading.metricCode === metricCode &&
      (zoneId === null || reading.zoneId === zoneId)
  );

  if (matches.length === 0) {
    return null;
  }

  return matches.reduce((latest, current) =>
    Date.parse(current.measuredAt) > Date.parse(latest.measuredAt)
      ? current
      : latest
  );
}

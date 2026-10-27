import type { SensorReading, AttentionItem } from '@/domain/types';
import { isReadingStale } from '@/domain/measurements/freshness';

export type AgronomicRule = {
  id: string;
  name: string;
  evaluate: (readings: SensorReading[], nowMs: number) => AttentionItem[];
};

export const TEMPERATURE_RULE: AgronomicRule = {
  id: 'rule-temp-high',
  name: 'High Temperature Alert',
  evaluate: (readings, nowMs) => {
    const alerts: AttentionItem[] = [];
    const tempReadings = readings.filter(r => r.metricCode === 'air_temperature' && !isReadingStale(r, nowMs));

    for (const reading of tempReadings) {
      if (reading.value !== null && reading.value > 28) {
        alerts.push({
          id: `alert-temp-high-${reading.greenhouseId}`,
          severity: 'warning',
          title: 'High temperature detected',
          explanation: `The temperature in this location is ${reading.value}°C, which is above the optimal range for most greenhouse crops.`,
          evidence: `Reading ${reading.value}°C at ${reading.measuredAt}.`,
          greenhouseId: reading.greenhouseId,
          cropCycleId: null,
        });
      }
    }
    return alerts;
  }
};

export const STALE_DATA_RULE: AgronomicRule = {
  id: 'rule-stale-data',
  name: 'Stale Data Alert',
  evaluate: (readings, nowMs) => {
    const alerts: AttentionItem[] = [];
    const staleReadings = readings.filter(r => isReadingStale(r, nowMs));

    for (const reading of staleReadings) {
      alerts.push({
        id: `alert-stale-${reading.id}`,
        severity: 'attention',
        title: `Stale ${reading.metricCode.replace('_', ' ')} reading`,
        explanation: 'The sensor data has not been updated for several hours. This could indicate a connectivity issue or sensor failure.',
        evidence: `Last reading was ${reading.value}${reading.unit} at ${reading.measuredAt}.`,
        greenhouseId: reading.greenhouseId,
        cropCycleId: null,
      });
    }
    return alerts;
  }
};

export const RULES: AgronomicRule[] = [TEMPERATURE_RULE, STALE_DATA_RULE];

export function evaluateRules(readings: SensorReading[], nowMs: number): AttentionItem[] {
  return RULES.flatMap(rule => rule.evaluate(readings, nowMs));
}

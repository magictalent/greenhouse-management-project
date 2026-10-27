import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FadeInView } from '@/components/ui/fade-in-view';
import { FarmColors } from '@/constants/farm-theme';
import { DEMO_CLOCK_MS, getDemoFarmSnapshot } from '@/data/demo-farm';
import {
  isReadingStale,
  latestReadingForMetric,
} from '@/domain/measurements/freshness';
import { formatFarmDateTime } from '@/features/dashboard/selectors';
import type { MetricCode } from '@/domain/types';

const snapshot = getDemoFarmSnapshot();

const METRICS: { code: MetricCode; label: string }[] = [
  { code: 'air_temperature', label: 'Air Temperature' },
  { code: 'relative_humidity', label: 'Relative Humidity' },
  { code: 'light_intensity', label: 'Light Intensity' },
  { code: 'carbon_dioxide', label: 'CO₂' },
  { code: 'root_zone_moisture', label: 'Root-zone Moisture' },
];

export default function MonitoringScreen() {
  const nowMs = DEMO_CLOCK_MS;

  return (
    <FarmScreen edges={['left', 'right']}>
      <FadeInView delay={100}>
        <Text style={styles.description}>
          Environmental monitoring across all greenhouses and zones.
        </Text>
      </FadeInView>

      {snapshot.greenhouses.map((gh, ghIndex) => (
        <FadeInView key={gh.id} delay={200 + ghIndex * 100}>
          <View style={styles.greenhouseSection}>
            <Text style={styles.sectionTitle}>{gh.name}</Text>
            <View style={styles.grid}>
              {METRICS.map((metric, mIndex) => {
                const reading = latestReadingForMetric(
                  snapshot.readings,
                  gh.id,
                  metric.code
                );
                const stale = reading ? isReadingStale(reading, nowMs) : false;

                return (
                  <FadeInView key={metric.code} delay={300 + ghIndex * 100 + mIndex * 50} style={styles.metricCardContainer}>
                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>{metric.label}</Text>
                      <Text
                        style={[
                          styles.metricValue,
                          stale && styles.staleValue,
                          !reading && styles.missingValue,
                        ]}>
                        {reading?.value != null
                          ? `${reading.value}${reading.unit}`
                          : '--'}
                      </Text>
                      <Text style={styles.metricTime}>
                        {reading
                          ? formatFarmDateTime(reading.measuredAt, snapshot.farm.timeZone, snapshot.farm.locale)
                          : 'No data'}
                      </Text>
                    </View>
                  </FadeInView>
                );
              })}
            </View>
          </View>
        </FadeInView>
      ))}

      <FadeInView delay={800}>
        <Link href="/monitoring/record" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Record Manual Measurement</Text>
          </Pressable>
        </Link>
      </FadeInView>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: FarmColors.body,
    marginBottom: 20,
  },
  greenhouseSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCardContainer: {
    width: '48%',
  },
  metricCard: {
    backgroundColor: FarmColors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: FarmColors.border,
    width: '100%',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: FarmColors.muted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: FarmColors.title,
  },
  staleValue: {
    color: FarmColors.warning,
  },
  missingValue: {
    color: FarmColors.border,
  },
  metricTime: {
    fontSize: 10,
    color: FarmColors.muted,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: FarmColors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

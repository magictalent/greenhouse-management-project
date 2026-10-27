import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { DEMO_CLOCK_MS, getDemoFarmSnapshot } from '@/data/demo-farm';
import { currentStage } from '@/domain/crop-cycles';
import { growthStageLabel } from '@/domain/crop-stages';
import {
  isReadingStale,
  latestReadingForMetric,
} from '@/domain/measurements/freshness';
import { formatFarmDateTime } from '@/features/dashboard/selectors';

const snapshot = getDemoFarmSnapshot();

export default function ZoneDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const zone = snapshot.zones.find((item) => item.id === id);

  if (!zone) {
    return (
      <FarmScreen edges={['left', 'right']}>
        <Text style={styles.title}>Zone not found</Text>
        <Text style={styles.body}>
          No sample zone matches this identifier.
        </Text>
      </FarmScreen>
    );
  }

  const greenhouse = snapshot.greenhouses.find(
    (gh) => gh.id === zone.greenhouseId
  );
  const nowMs = DEMO_CLOCK_MS;
  const cycles = snapshot.cropCycles.filter(
    (cycle) => cycle.zoneId === zone.id
  );

  const temperature = latestReadingForMetric(
    snapshot.readings,
    zone.greenhouseId,
    'air_temperature',
    zone.id
  );
  const humidity = latestReadingForMetric(
    snapshot.readings,
    zone.greenhouseId,
    'relative_humidity',
    zone.id
  );

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: zone.name }} />

      <Text style={styles.kicker}>
        {greenhouse?.name ?? 'Greenhouse'} · {zone.growingMethod}
      </Text>
      <Text style={styles.title}>{zone.name}</Text>

      <Text style={styles.sectionTitle}>Zone Conditions</Text>
      <ReadingBlock
        label="Air temperature"
        readingLabel={readingLabel(temperature, nowMs)}
      />
      <ReadingBlock
        label="Relative humidity"
        readingLabel={readingLabel(humidity, nowMs)}
      />

      <Text style={styles.sectionTitle}>Active Crop Cycles</Text>
      {cycles.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.body}>No active crop cycles in this zone.</Text>
        </View>
      ) : (
        cycles.map((cycle) => {
          const cultivar = snapshot.cultivars.find(
            (item) => item.id === cycle.cultivarId
          );
          const species = snapshot.species.find(
            (item) => item.id === cultivar?.speciesId
          );
          const stage = currentStage(cycle.id, snapshot.stageHistory);

          return (
            <View key={cycle.id} style={styles.card}>
              <Text style={styles.cardKicker}>
                {species?.commonName ?? 'Crop'}
              </Text>
              <Text style={styles.cardTitle}>
                {cultivar?.name ?? 'Variety unknown'}
              </Text>
              <Text style={styles.body}>
                Stage: {stage ? growthStageLabel(stage) : 'Not recorded'}
              </Text>
              <Text style={styles.muted}>
                Status: {cycle.status} · {cycle.plantCount ?? 'Unknown'} plants
              </Text>
              <Text style={styles.muted}>
                Planted: {formatFarmDateTime(cycle.plantingDate, snapshot.farm.timeZone, snapshot.farm.locale)}
              </Text>
            </View>
          );
        })
      )}
    </FarmScreen>
  );
}

function ReadingBlock({
  label,
  readingLabel: value,
}: {
  label: string;
  readingLabel: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{label}</Text>
      <Text style={styles.body}>{value}</Text>
    </View>
  );
}

function readingLabel(
  reading: ReturnType<typeof latestReadingForMetric>,
  nowMs: number
): string {
  if (!reading || reading.value === null) {
    return 'No measurement for this specific zone';
  }

  const when = formatFarmDateTime(
    reading.measuredAt,
    snapshot.farm.timeZone,
    snapshot.farm.locale
  );
  const stale = isReadingStale(reading, nowMs) ? 'stale sample' : 'sample';
  return `${reading.value} ${reading.unit} · ${stale} · ${when}`;
}

const styles = StyleSheet.create({
  kicker: {
    color: FarmColors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: FarmColors.title,
    marginTop: 6,
    marginBottom: 8,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
    marginTop: 18,
    marginBottom: 8,
  },
  card: {
    backgroundColor: FarmColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FarmColors.border,
  },
  cardKicker: {
    color: FarmColors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: FarmColors.title,
  },
  muted: {
    color: FarmColors.muted,
    fontSize: 13,
    marginTop: 4,
  },
});

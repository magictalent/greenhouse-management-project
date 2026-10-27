import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FadeInView } from '@/components/ui/fade-in-view';
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

export default function GreenhouseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const greenhouseId = Array.isArray(id) ? id[0] : id;
  const greenhouse = snapshot.greenhouses.find((item) => item.id === greenhouseId);

  if (!greenhouse) {
    return (
      <FarmScreen edges={['left', 'right']}>
        <Text style={styles.title}>Greenhouse not found</Text>
        <Text style={styles.body}>
          No sample greenhouse matches this identifier.
        </Text>
      </FarmScreen>
    );
  }

  const zones = snapshot.zones.filter(
    (zone) => zone.greenhouseId === greenhouse.id
  );
  const nowMs = DEMO_CLOCK_MS;
  const temperature = latestReadingForMetric(
    snapshot.readings,
    greenhouse.id,
    'air_temperature'
  );
  const humidity = latestReadingForMetric(
    snapshot.readings,
    greenhouse.id,
    'relative_humidity'
  );

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: greenhouse.name }} />

      <FadeInView delay={100}>
        <Text style={styles.kicker}>{greenhouse.growingMethod} system</Text>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{greenhouse.name}</Text>
          <Link
            href={{
              pathname: '/greenhouses/edit/[id]',
              params: { id: greenhouse.id },
            }}
            asChild>
            <Pressable style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </Link>
        </View>
        <Text style={styles.body}>
          {greenhouse.areaSquareMeters != null
            ? `${greenhouse.areaSquareMeters} m² floor area`
            : 'Floor area unknown'}
        </Text>
        {greenhouse.notes ? (
          <Text style={styles.notes}>{greenhouse.notes}</Text>
        ) : null}
      </FadeInView>

      <Text style={styles.sectionTitle}>Latest sample readings</Text>
      <FadeInView delay={200}>
        <ReadingBlock
          label="Air temperature"
          readingLabel={readingLabel(temperature, nowMs)}
        />
      </FadeInView>
      <FadeInView delay={250}>
        <ReadingBlock
          label="Relative humidity"
          readingLabel={readingLabel(humidity, nowMs)}
        />
      </FadeInView>

      <Text style={styles.sectionTitle}>Zones</Text>
      {zones.map((zone, index) => {
        const cycles = snapshot.cropCycles.filter(
          (cycle) => cycle.zoneId === zone.id
        );

        return (
          <FadeInView key={zone.id} delay={300 + index * 50}>
            <Link
              href={{
                pathname: '/greenhouses/zones/[id]',
                params: { id: zone.id },
              }}
              asChild>
              <Pressable style={styles.card}>
                <Text style={styles.cardTitle}>{zone.name}</Text>
                <Text style={styles.muted}>{zone.growingMethod}</Text>
                {cycles.length === 0 ? (
                  <Text style={styles.body}>No crop cycle assigned.</Text>
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
                      <Text key={cycle.id} style={styles.body}>
                        {species?.commonName ?? 'Crop'} · {cultivar?.name ?? 'variety unknown'}{' '}
                        · {stage ? growthStageLabel(stage) : 'stage not recorded'}
                      </Text>
                    );
                  })
                )}
                <Text style={styles.link}>View zone details</Text>
              </Pressable>
            </Link>
          </FadeInView>
        );
      })}

      <FadeInView delay={500}>
        <Link href="/crops/index" style={styles.link}>
          Open crop guides
        </Link>
      </FadeInView>
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
    return 'No measurement for this location';
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: FarmColors.title,
    flex: 1,
  },
  editButton: {
    backgroundColor: FarmColors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: FarmColors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  notes: {
    color: FarmColors.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 8,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: FarmColors.title,
  },
  muted: {
    color: FarmColors.muted,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 6,
  },
  link: {
    color: FarmColors.accent,
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
  },
});

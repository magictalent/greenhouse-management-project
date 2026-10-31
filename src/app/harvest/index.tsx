import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';
import { formatFarmDateTime } from '@/features/dashboard/selectors';

const snapshot = getDemoFarmSnapshot();

export default function HarvestHistoryScreen() {
  const harvests = snapshot.harvests.sort(
    (a, b) => Date.parse(b.harvestedAt) - Date.parse(a.harvestedAt)
  );

  return (
    <FarmScreen edges={['left', 'right']}>
      <Text style={styles.description}>
        Historical harvest records and yield performance.
      </Text>

      {harvests.map((harvest) => {
        const cycle = snapshot.cropCycles.find(
          (c) => c.id === harvest.cropCycleId
        );
        const cultivar = snapshot.cultivars.find(
          (item) => item.id === cycle?.cultivarId
        );
        const species = snapshot.species.find(
          (item) => item.id === cultivar?.speciesId
        );

        return (
          <View key={harvest.id} style={styles.card}>
            <Text style={styles.kicker}>
              {species?.commonName ?? 'Crop'} · {cultivar?.name ?? 'Variety'}
            </Text>
            <Text style={styles.title}>
              {harvest.marketableKg ?? 0} kg marketable
            </Text>
            <Text style={styles.body}>
              Rejected: {harvest.rejectedKg ?? 0} kg ·{' '}
              {harvest.isEstimate ? 'Estimate' : 'Final weight'}
            </Text>
            <Text style={styles.muted}>
              Harvested on {formatFarmDateTime(harvest.harvestedAt, snapshot.farm.timeZone, snapshot.farm.locale)}
            </Text>
          </View>
        );
      })}

      <Link href="/harvest/record" asChild>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Record New Harvest</Text>
        </Pressable>
      </Link>
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
  card: {
    backgroundColor: FarmColors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FarmColors.border,
  },
  kicker: {
    color: FarmColors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    marginTop: 4,
  },
  muted: {
    color: FarmColors.muted,
    fontSize: 13,
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

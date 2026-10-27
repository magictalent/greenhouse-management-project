import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';
import { currentStage } from '@/domain/crop-cycles';
import { growthStageLabel } from '@/domain/crop-stages';

const snapshot = getDemoFarmSnapshot();

export default function CropCycleListScreen() {
  return (
    <FarmScreen edges={['left', 'right']}>
      <Text style={styles.description}>
        Active and historical crop cycles on the farm.
      </Text>

      {snapshot.cropCycles.map((cycle) => {
        const cultivar = snapshot.cultivars.find(
          (item) => item.id === cycle.cultivarId
        );
        const species = snapshot.species.find(
          (item) => item.id === cultivar?.speciesId
        );
        const zone = snapshot.zones.find((item) => item.id === cycle.zoneId);
        const greenhouse = snapshot.greenhouses.find(
          (item) => item.id === zone?.greenhouseId
        );
        const stage = currentStage(cycle.id, snapshot.stageHistory);

        return (
          <Link
            key={cycle.id}
            href={{
              pathname: '/crop-cycles/[id]',
              params: { id: cycle.id },
            }}
            asChild>
            <Pressable style={styles.card}>
              <Text style={styles.kicker}>
                {greenhouse?.name ?? 'Unknown'} · {zone?.name ?? 'Zone'}
              </Text>
              <Text style={styles.title}>
                {species?.commonName ?? 'Crop'} · {cultivar?.name ?? 'Variety'}
              </Text>
              <Text style={styles.body}>
                {stage ? growthStageLabel(stage) : 'Stage unknown'} ·{' '}
                {cycle.status}
              </Text>
              <Text style={styles.muted}>
                Planted: {cycle.plantingDate}
                {cycle.plantCount ? ` · ${cycle.plantCount} plants` : ''}
              </Text>
              <Text style={styles.link}>View cycle history</Text>
            </Pressable>
          </Link>
        );
      })}

      <Link href="/crop-cycles/create" asChild>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start new crop cycle</Text>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: FarmColors.surface,
    borderRadius: 16,
    padding: 16,
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
  link: {
    color: FarmColors.accent,
    fontWeight: '600',
    marginTop: 10,
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

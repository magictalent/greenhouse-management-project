import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';
import { currentStage } from '@/domain/crop-cycles';
import { growthStageLabel } from '@/domain/crop-stages';
import { formatFarmDateTime } from '@/features/dashboard/selectors';

const snapshot = getDemoFarmSnapshot();

export default function CropCycleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cycle = snapshot.cropCycles.find((item) => item.id === id);

  if (!cycle) {
    return (
      <FarmScreen edges={['left', 'right']}>
        <Text style={styles.title}>Crop cycle not found</Text>
      </FarmScreen>
    );
  }

  const cultivar = snapshot.cultivars.find((item) => item.id === cycle.cultivarId);
  const species = snapshot.species.find((item) => item.id === cultivar?.speciesId);
  const zone = snapshot.zones.find((item) => item.id === cycle.zoneId);
  const greenhouse = snapshot.greenhouses.find((item) => item.id === zone?.greenhouseId);
  
  const stageHistory = snapshot.stageHistory
    .filter((item) => item.cropCycleId === cycle.id)
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
  
  const stage = currentStage(cycle.id, snapshot.stageHistory);

  const handleUpdateStage = () => {
    Alert.alert(
      'Update Growth Stage',
      'Select the new growth stage for this crop cycle.',
      [
        { text: 'Vegetative', onPress: () => {} },
        { text: 'Flowering', onPress: () => {} },
        { text: 'Fruiting', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Crop Cycle' }} />

      <Text style={styles.kicker}>
        {greenhouse?.name ?? 'Greenhouse'} · {zone?.name ?? 'Zone'}
      </Text>
      <Text style={styles.title}>
        {species?.commonName ?? 'Crop'} · {cultivar?.name ?? 'Variety'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.body}>Current Stage: {stage ? growthStageLabel(stage) : 'Unknown'}</Text>
        <Text style={styles.body}>Status: {cycle.status}</Text>
        <Text style={styles.body}>Plant Count: {cycle.plantCount ?? 'Unknown'}</Text>
        <Text style={styles.body}>Planted: {cycle.plantingDate}</Text>
        
        <Pressable style={styles.secondaryButton} onPress={handleUpdateStage}>
          <Text style={styles.secondaryButtonText}>Record stage transition</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Stage History</Text>
      {stageHistory.map((history) => (
        <View key={history.id} style={styles.historyItem}>
          <View style={styles.historyDot} />
          <View style={styles.historyContent}>
            <Text style={styles.historyStage}>{growthStageLabel(history.stage)}</Text>
            <Text style={styles.muted}>
              Started: {formatFarmDateTime(history.startedAt, snapshot.farm.timeZone, snapshot.farm.locale)}
            </Text>
            {history.endedAt && (
              <Text style={styles.muted}>
                Ended: {formatFarmDateTime(history.endedAt, snapshot.farm.timeZone, snapshot.farm.locale)}
              </Text>
            )}
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Expected Harvest</Text>
      <View style={styles.card}>
        <Text style={styles.body}>
          Starts: {cycle.expectedHarvestStart ?? 'Not set'}
        </Text>
        <Text style={styles.body}>
          Ends: {cycle.expectedHarvestEnd ?? 'Not set'}
        </Text>
      </View>
    </FarmScreen>
  );
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
    marginTop: 22,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 2,
  },
  muted: {
    color: FarmColors.muted,
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: FarmColors.accentSoft,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: FarmColors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingLeft: 4,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: FarmColors.accent,
    marginTop: 6,
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyStage: {
    fontSize: 16,
    fontWeight: '700',
    color: FarmColors.title,
  },
});

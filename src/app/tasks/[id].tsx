import { Stack, useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';
import { formatFarmDateTime } from '@/features/dashboard/selectors';

const snapshot = getDemoFarmSnapshot();

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = snapshot.tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <FarmScreen edges={['left', 'right']}>
        <Text style={styles.title}>Task not found</Text>
      </FarmScreen>
    );
  }

  const greenhouse = snapshot.greenhouses.find(
    (gh) => gh.id === task.greenhouseId
  );
  const cycle = snapshot.cropCycles.find(
    (c) => c.id === task.cropCycleId
  );

  const handleComplete = () => {
    Alert.alert(
      'Demo Mode',
      'Task status is not persisted in this demo version.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Task Details' }} />

      <Text style={styles.kicker}>
        {greenhouse?.name ?? 'General Farm Task'}
        {cycle ? ` · ${cycle.id}` : ''}
      </Text>
      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Due Date</Text>
        <Text style={styles.body}>
          {formatFarmDateTime(task.dueAt, snapshot.farm.timeZone, snapshot.farm.locale)}
        </Text>

        <Text style={styles.label}>Status</Text>
        <Text style={[styles.body, styles.statusText]}>
          {task.status.toUpperCase()}
        </Text>
      </View>

      {task.status === 'pending' && (
        <Pressable style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Mark as Completed</Text>
        </Pressable>
      )}

      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Back to List</Text>
      </Pressable>
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
    fontSize: 24,
    fontWeight: '800',
    color: FarmColors.title,
    marginTop: 6,
    marginBottom: 20,
  },
  card: {
    backgroundColor: FarmColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: FarmColors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: FarmColors.muted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  body: {
    color: FarmColors.title,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  statusText: {
    fontWeight: '700',
    color: FarmColors.accent,
  },
  completeButton: {
    backgroundColor: FarmColors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: FarmColors.muted,
    fontWeight: '600',
    fontSize: 16,
  },
});

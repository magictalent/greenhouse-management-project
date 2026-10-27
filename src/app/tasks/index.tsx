import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FadeInView } from '@/components/ui/fade-in-view';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';
import { formatFarmDateTime } from '@/features/dashboard/selectors';

const snapshot = getDemoFarmSnapshot();

export default function TaskListScreen() {
  const pendingTasks = snapshot.tasks.filter((t) => t.status === 'pending');
  const completedTasks = snapshot.tasks.filter((t) => t.status === 'completed');

  return (
    <FarmScreen edges={['left', 'right']}>
      <FadeInView delay={100}>
        <Text style={styles.description}>
          Daily operations and maintenance tasks.
        </Text>
      </FadeInView>

      <Text style={styles.sectionTitle}>Pending Tasks</Text>
      {pendingTasks.length === 0 ? (
        <Text style={styles.body}>No pending tasks.</Text>
      ) : (
        pendingTasks.map((task, index) => (
          <FadeInView key={task.id} delay={200 + index * 50}>
            <TaskCard task={task} />
          </FadeInView>
        ))
      )}

      {completedTasks.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, styles.spaced]}>Completed</Text>
          {completedTasks.map((task, index) => (
            <FadeInView key={task.id} delay={400 + index * 50}>
              <TaskCard task={task} />
            </FadeInView>
          ))}
        </>
      )}

      <FadeInView delay={600}>
        <Pressable style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>Add new task</Text>
        </Pressable>
      </FadeInView>
    </FarmScreen>
  );
}

function TaskCard({ task }: { task: typeof snapshot.tasks[0] }) {
  const greenhouse = snapshot.greenhouses.find(
    (gh) => gh.id === task.greenhouseId
  );

  return (
    <Link
      href={{
        pathname: '/tasks/[id]',
        params: { id: task.id },
      }}
      asChild>
      <Pressable style={styles.card}>
        <View style={styles.cardContent}>
          <View
            style={[
              styles.statusDot,
              task.status === 'completed' && styles.statusDotCompleted,
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.cardTitle,
                task.status === 'completed' && styles.completedText,
              ]}>
              {task.title}
            </Text>
            <Text style={styles.muted}>
              {greenhouse?.name ?? 'General'} · Due{' '}
              {formatFarmDateTime(task.dueAt, snapshot.farm.timeZone, snapshot.farm.locale)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: FarmColors.body,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 12,
    marginTop: 8,
  },
  spaced: {
    marginTop: 24,
  },
  card: {
    backgroundColor: FarmColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FarmColors.border,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E6D3A8',
    marginRight: 16,
  },
  statusDotCompleted: {
    backgroundColor: FarmColors.accent,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: FarmColors.title,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: FarmColors.muted,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    marginBottom: 12,
  },
  muted: {
    color: FarmColors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: FarmColors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

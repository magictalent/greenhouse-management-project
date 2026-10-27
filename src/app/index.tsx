import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FadeInView } from '@/components/ui/fade-in-view';
import { FarmColors } from '@/constants/farm-theme';
import {
  DEMO_CLOCK_MS,
  SAMPLE_DATA_NOTICE,
  getDemoFarmSnapshot,
} from '@/data/demo-farm';
import {
  buildDashboardModel,
  formatFarmDateTime,
} from '@/features/dashboard/selectors';

const snapshot = getDemoFarmSnapshot();

export default function DashboardScreen() {
  const model = buildDashboardModel(snapshot, DEMO_CLOCK_MS);

  return (
    <FarmScreen>
      <FadeInView delay={100}>
        <Text style={styles.eyebrow}>GREENHOUSE OPERATIONS</Text>
        <Text style={styles.title}>{model.farmName}</Text>
        <Text style={styles.description}>
          {model.greenhouseCount} greenhouses · {model.activeCycleCount} active
          crop cycles · {model.unitSystem} units · {model.timeZone}
        </Text>
      </FadeInView>

      <FadeInView delay={200}>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{SAMPLE_DATA_NOTICE}</Text>
        </View>
      </FadeInView>

      <Text style={styles.sectionTitle}>Needs attention</Text>
      {model.attentionItems.map((item, index) => (
        <FadeInView key={item.id} delay={300 + index * 50}>
          <View
            style={[
              styles.card,
              item.severity === 'attention' ? styles.warningCard : styles.infoCard,
            ]}>
            <Text style={styles.cardKicker}>
              {item.severity === 'attention' ? 'Check this' : 'Note'}
            </Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.body}>{item.explanation}</Text>
            <Text style={styles.evidence}>Evidence: {item.evidence}</Text>
          </View>
        </FadeInView>
      ))}

      <Text style={styles.sectionTitle}>Current conditions</Text>
      <Text style={styles.helper}>
        Each reading belongs to a named location. It does not represent the
        whole greenhouse.
      </Text>
      {model.conditions.map((condition, index) => (
        <FadeInView key={`${condition.greenhouseId}-${condition.metricLabel}`} delay={400 + index * 50}>
          <Link
            href={{
              pathname: '/greenhouses/[id]',
              params: { id: condition.greenhouseId },
            }}
            asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardKicker}>
                {condition.greenhouseName}
                {condition.zoneLabel ? ` · ${condition.zoneLabel}` : ''}
              </Text>
              <Text style={styles.cardTitle}>{condition.metricLabel}</Text>
              <Text style={styles.metricValue}>{condition.displayValue}</Text>
              <Text style={styles.muted}>
                {condition.isMissing
                  ? 'No measurement available'
                  : condition.isStale
                    ? `Stale sample · last measured ${formatTime(condition.measuredAt)}`
                    : `Sample · measured ${formatTime(condition.measuredAt)}`}
              </Text>
            </Pressable>
          </Link>
        </FadeInView>
      ))}

      <Text style={styles.sectionTitle}>Tasks</Text>
      {model.todayTasks.map((task, index) => (
        <FadeInView key={task.id} delay={500 + index * 50}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.muted}>
              Due {formatTime(task.dueAt)} · completion is not recorded yet
            </Text>
          </View>
        </FadeInView>
      ))}

      <Text style={styles.sectionTitle}>Crop cycles</Text>
      {model.cropCycles.map((cycle, index) => (
        <FadeInView key={cycle.id} delay={600 + index * 50}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {cycle.cropName} · {cycle.cultivarName}
            </Text>
            <Text style={styles.body}>
              {cycle.greenhouseName} · {cycle.zoneName}
            </Text>
            <Text style={styles.muted}>
              {cycle.stageLabel}
              {cycle.plantCount != null ? ` · ${cycle.plantCount} plants` : ''}
              {` · ${cycle.status}`}
            </Text>
          </View>
        </FadeInView>
      ))}

      <Text style={styles.sectionTitle}>Latest harvest</Text>
      {model.latestHarvest ? (
        <FadeInView delay={700}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {model.latestHarvest.cropName} from {model.latestHarvest.greenhouseName}
            </Text>
            <Text style={styles.body}>
              Marketable {formatKg(model.latestHarvest.marketableKg)} · rejected{' '}
              {formatKg(model.latestHarvest.rejectedKg)}
            </Text>
            <Text style={styles.muted}>
              {model.latestHarvest.isEstimate ? 'Estimate' : 'Recorded harvest'} ·{' '}
              {formatTime(model.latestHarvest.harvestedAt)}
            </Text>
          </View>
        </FadeInView>
      ) : (
        <Text style={styles.body}>No harvest records in the sample set.</Text>
      )}

      <FadeInView delay={800}>
        <Link href="/greenhouses/index" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Open greenhouse list</Text>
          </Pressable>
        </Link>
      </FadeInView>
    </FarmScreen>
  );
}

function formatTime(iso: string | null): string {
  if (!iso) {
    return 'unknown time';
  }

  return formatFarmDateTime(
    iso,
    snapshot.farm.timeZone,
    snapshot.farm.locale
  );
}

function formatKg(value: number | null): string {
  return value == null ? 'not recorded' : `${value} kg`;
}

const styles = StyleSheet.create({
  eyebrow: {
    color: FarmColors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: FarmColors.title,
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: FarmColors.body,
    marginBottom: 16,
  },
  notice: {
    backgroundColor: FarmColors.infoSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 22,
  },
  noticeText: {
    color: FarmColors.info,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 8,
    marginTop: 8,
  },
  helper: {
    color: FarmColors.muted,
    fontSize: 13,
    lineHeight: 19,
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
  warningCard: {
    backgroundColor: FarmColors.warningSoft,
    borderColor: '#E6D3A8',
  },
  infoCard: {
    backgroundColor: FarmColors.infoSoft,
    borderColor: '#C9DEE6',
  },
  cardKicker: {
    color: FarmColors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 4,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    lineHeight: 21,
  },
  evidence: {
    color: FarmColors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: FarmColors.title,
    marginVertical: 4,
  },
  muted: {
    color: FarmColors.muted,
    fontSize: 13,
    lineHeight: 19,
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

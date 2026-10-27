import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getGrowingGuide } from '@/features/crops/growing-guides';

export default function CropGuideScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const guideId = Array.isArray(id) ? id[0] : id;
  const guide = guideId ? getGrowingGuide(guideId) : undefined;

  if (!guide) {
    return (
      <FarmScreen edges={['left', 'right']}>
        <Text style={styles.title}>Guide not found</Text>
        <Link href="/crops/index" style={styles.back}>
          All vegetables
        </Link>
      </FarmScreen>
    );
  }

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: guide.name }} />

      <Text style={styles.emoji}>{guide.emoji}</Text>
      <Text style={styles.title}>{guide.name} Growing Guide</Text>
      <Text style={styles.description}>{guide.description}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Temperature</Text>
        <Text style={styles.body}>{guide.temperature}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Watering</Text>
        <Text style={styles.body}>{guide.watering}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cultivation stages</Text>
        {guide.stages.map((stage, index) => (
          <View key={stage} style={styles.stageRow}>
            <Text style={styles.stageNumber}>{index + 1}</Text>
            <Text style={styles.body}>{stage}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Growing tips</Text>
        {guide.tips.map((tip) => (
          <Text key={tip} style={styles.tip}>
            • {tip}
          </Text>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Growing conditions vary by cultivar, climate, greenhouse design, and
        growing system. Verify specific targets with locally appropriate
        agricultural guidance.
      </Text>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 38,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: FarmColors.title,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: FarmColors.body,
    marginBottom: 18,
  },
  card: {
    backgroundColor: FarmColors.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: FarmColors.border,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 10,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    lineHeight: 22,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  stageNumber: {
    width: 28,
    height: 28,
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 14,
    backgroundColor: FarmColors.accentSoft,
    color: FarmColors.accent,
    fontWeight: '700',
    paddingTop: 4,
  },
  tip: {
    fontSize: 14,
    lineHeight: 23,
    color: '#526356',
    marginTop: 7,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 19,
    color: FarmColors.muted,
    marginTop: 6,
    marginBottom: 16,
  },
  back: {
    color: FarmColors.accent,
    fontWeight: '600',
    marginTop: 12,
  },
});

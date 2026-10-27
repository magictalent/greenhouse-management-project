import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FadeInView } from '@/components/ui/fade-in-view';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';

const snapshot = getDemoFarmSnapshot();

export default function GreenhouseListScreen() {
  return (
    <FarmScreen edges={['left', 'right']}>
      <FadeInView delay={100}>
        <Text style={styles.description}>
          Each greenhouse can use a different growing method and contain multiple
          zones. This list is sample data.
        </Text>
      </FadeInView>

      {snapshot.greenhouses.map((greenhouse, index) => {
        const zoneCount = snapshot.zones.filter(
          (zone) => zone.greenhouseId === greenhouse.id
        ).length;

        return (
          <FadeInView key={greenhouse.id} delay={200 + index * 50}>
            <Link
              href={{
                pathname: '/greenhouses/[id]',
                params: { id: greenhouse.id },
              }}
              asChild>
              <Pressable style={styles.card}>
                <Text style={styles.kicker}>{greenhouse.growingMethod}</Text>
                <Text style={styles.title}>{greenhouse.name}</Text>
                <Text style={styles.body}>
                  {zoneCount} zones
                  {greenhouse.areaSquareMeters != null
                    ? ` · ${greenhouse.areaSquareMeters} m²`
                    : ' · area unknown'}
                </Text>
                <Text style={styles.link}>View details</Text>
              </Pressable>
            </Link>
          </FadeInView>
        );
      })}
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
    fontSize: 20,
    fontWeight: '700',
    color: FarmColors.title,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    marginTop: 4,
  },
  link: {
    color: FarmColors.accent,
    fontWeight: '600',
    marginTop: 10,
  },
});

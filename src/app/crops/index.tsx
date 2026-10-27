import { useMemo, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';
import { GROWING_GUIDES } from '@/features/crops/growing-guides';

const snapshot = getDemoFarmSnapshot();

export default function CropsScreen() {
  const [search, setSearch] = useState('');

  const filteredGuides = useMemo(() => {
    const query = search.trim().toLowerCase();
    return GROWING_GUIDES.filter(
      (guide) =>
        guide.name.toLowerCase().includes(query) ||
        guide.category.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <FarmScreen edges={['left', 'right']}>
      <Text style={styles.description}>
        Reference guides from the original home screen, linked to the demo farm
        crop catalogue. These are not cultivar-specific prescriptions.
      </Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search vegetables..."
        placeholderTextColor={FarmColors.muted}
        style={styles.search}
        accessibilityLabel="Search crop guides"
      />

      <Text style={styles.sectionTitle}>On this demo farm</Text>
      {snapshot.cultivars.map((cultivar) => {
        const species = snapshot.species.find(
          (item) => item.id === cultivar.speciesId
        );
        return (
          <Text key={cultivar.id} style={styles.body}>
            {species?.commonName ?? 'Crop'} · {cultivar.name}
          </Text>
        );
      })}

      <Text style={[styles.sectionTitle, styles.spaced]}>Growing guides</Text>
      {filteredGuides.map((guide) => (
        <Link
          key={guide.id}
          href={{ pathname: '/crops/[id]', params: { id: guide.id } }}
          asChild>
          <Pressable style={styles.card}>
            <View style={styles.icon}>
              <Text style={styles.emoji}>{guide.emoji}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{guide.name}</Text>
              <Text style={styles.muted}>{guide.category}</Text>
              <Text style={styles.link}>View growing guide</Text>
            </View>
          </Pressable>
        </Link>
      ))}

      {filteredGuides.length === 0 ? (
        <Text style={styles.body}>No vegetables found. Try another search.</Text>
      ) : null}
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
  search: {
    backgroundColor: FarmColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FarmColors.border,
    padding: 15,
    fontSize: 16,
    marginBottom: 22,
    color: FarmColors.title,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 8,
  },
  spaced: {
    marginTop: 20,
  },
  body: {
    color: FarmColors.body,
    fontSize: 14,
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FarmColors.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: FarmColors.border,
    gap: 14,
  },
  icon: {
    width: 68,
    height: 76,
    borderRadius: 12,
    backgroundColor: FarmColors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: FarmColors.title,
  },
  muted: {
    fontSize: 13,
    color: FarmColors.muted,
    marginTop: 3,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: FarmColors.accent,
    marginTop: 9,
  },
});

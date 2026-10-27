import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';

const snapshot = getDemoFarmSnapshot();

export default function CreateCropCycleScreen() {
  const [selectedZoneId, setSelectedZoneId] = useState(snapshot.zones[0]?.id ?? '');
  const [selectedCultivarId, setSelectedCultivarId] = useState(snapshot.cultivars[0]?.id ?? '');
  const [plantCount, setPlantCount] = useState('');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCreate = () => {
    Alert.alert(
      'Demo Mode',
      'This feature is not fully implemented in the demo. In a real app, this would create a new crop cycle in the database.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'New Crop Cycle' }} />

      <Text style={styles.label}>Zone</Text>
      <View style={styles.pickerContainer}>
        {snapshot.zones.map((zone) => (
          <Pressable
            key={zone.id}
            style={[
              styles.pickerItem,
              selectedZoneId === zone.id && styles.pickerItemActive,
            ]}
            onPress={() => setSelectedZoneId(zone.id)}>
            <Text
              style={[
                styles.pickerItemText,
                selectedZoneId === zone.id && styles.pickerItemTextActive,
              ]}>
              {zone.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Cultivar</Text>
      <View style={styles.pickerContainer}>
        {snapshot.cultivars.map((cultivar) => (
          <Pressable
            key={cultivar.id}
            style={[
              styles.pickerItem,
              selectedCultivarId === cultivar.id && styles.pickerItemActive,
            ]}
            onPress={() => setSelectedCultivarId(cultivar.id)}>
            <Text
              style={[
                styles.pickerItemText,
                selectedCultivarId === cultivar.id && styles.pickerItemTextActive,
              ]}>
              {cultivar.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Plant Count</Text>
      <TextInput
        style={styles.input}
        value={plantCount}
        onChangeText={setPlantCount}
        placeholder="e.g. 240"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Planting Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={plantingDate}
        onChangeText={setPlantingDate}
        placeholder="YYYY-MM-DD"
      />

      <Pressable style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Start Crop Cycle</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  pickerItem: {
    backgroundColor: FarmColors.surface,
    borderWidth: 1,
    borderColor: FarmColors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerItemActive: {
    backgroundColor: FarmColors.accent,
    borderColor: FarmColors.accent,
  },
  pickerItemText: {
    fontSize: 14,
    color: FarmColors.body,
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: FarmColors.surface,
    borderWidth: 1,
    borderColor: FarmColors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: FarmColors.title,
  },
  createButton: {
    backgroundColor: FarmColors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  createButtonText: {
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

import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';

const snapshot = getDemoFarmSnapshot();

export default function RecordHarvestScreen() {
  const activeCycles = snapshot.cropCycles.filter(
    (c) => c.status === 'active' || c.status === 'harvesting'
  );

  const [selectedCycleId, setSelectedCycleId] = useState(activeCycles[0]?.id ?? '');
  const [marketableKg, setMarketableKg] = useState('');
  const [rejectedKg, setRejectedKg] = useState('');
  const [isEstimate, setIsEstimate] = useState(false);

  const handleSave = () => {
    if (!marketableKg || isNaN(parseFloat(marketableKg))) {
      Alert.alert('Invalid Input', 'Please enter a valid marketable weight.');
      return;
    }

    Alert.alert(
      'Harvest Recorded',
      `Harvest of ${marketableKg} kg recorded for ${selectedCycleId} (Demo Mode).`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Record Harvest' }} />

      <Text style={styles.label}>Crop Cycle</Text>
      <View style={styles.pickerContainer}>
        {activeCycles.map((cycle) => {
          const cultivar = snapshot.cultivars.find(c => c.id === cycle.cultivarId);
          const zone = snapshot.zones.find(z => z.id === cycle.zoneId);
          return (
            <Pressable
              key={cycle.id}
              style={[
                styles.pickerItem,
                selectedCycleId === cycle.id && styles.pickerItemActive,
              ]}
              onPress={() => setSelectedCycleId(cycle.id)}>
              <Text
                style={[
                  styles.pickerItemText,
                  selectedCycleId === cycle.id && styles.pickerItemTextActive,
                ]}>
                {cultivar?.name} ({zone?.name})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Marketable Weight (kg)</Text>
      <TextInput
        style={styles.input}
        value={marketableKg}
        onChangeText={setMarketableKg}
        placeholder="e.g. 85.5"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Rejected Weight (kg)</Text>
      <TextInput
        style={styles.input}
        value={rejectedKg}
        onChangeText={setRejectedKg}
        placeholder="e.g. 2.0"
        keyboardType="numeric"
      />

      <View style={styles.checkboxContainer}>
        <Pressable 
          style={[styles.checkbox, isEstimate && styles.checkboxChecked]} 
          onPress={() => setIsEstimate(!isEstimate)}
        />
        <Text style={styles.checkboxLabel}>This is an estimate</Text>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Harvest Record</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: FarmColors.accent,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: FarmColors.accent,
  },
  checkboxLabel: {
    fontSize: 14,
    color: FarmColors.title,
  },
  saveButton: {
    backgroundColor: FarmColors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
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

import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';
import type { MetricCode } from '@/domain/types';

const snapshot = getDemoFarmSnapshot();

const METRICS: { code: MetricCode; label: string; unit: string }[] = [
  { code: 'air_temperature', label: 'Air Temperature', unit: '°C' },
  { code: 'relative_humidity', label: 'Relative Humidity', unit: '%' },
  { code: 'light_intensity', label: 'Light Intensity', unit: 'lux' },
  { code: 'carbon_dioxide', label: 'CO₂', unit: 'ppm' },
  { code: 'root_zone_moisture', label: 'Root-zone Moisture', unit: '%' },
];

export default function RecordMeasurementScreen() {
  const [selectedGhId, setSelectedGhId] = useState(snapshot.greenhouses[0]?.id ?? '');
  const [selectedMetric, setSelectedMetric] = useState<MetricCode>('air_temperature');
  const [value, setValue] = useState('');

  const handleSave = () => {
    if (!value || isNaN(parseFloat(value))) {
      Alert.alert('Invalid Input', 'Please enter a valid numeric value.');
      return;
    }

    Alert.alert(
      'Measurement Recorded',
      `Manual reading of ${value}${METRICS.find(m => m.code === selectedMetric)?.unit} for ${snapshot.greenhouses.find(g => g.id === selectedGhId)?.name} recorded (Demo Mode).`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Record Measurement' }} />

      <Text style={styles.label}>Greenhouse</Text>
      <View style={styles.pickerContainer}>
        {snapshot.greenhouses.map((gh) => (
          <Pressable
            key={gh.id}
            style={[
              styles.pickerItem,
              selectedGhId === gh.id && styles.pickerItemActive,
            ]}
            onPress={() => setSelectedGhId(gh.id)}>
            <Text
              style={[
                styles.pickerItemText,
                selectedGhId === gh.id && styles.pickerItemTextActive,
              ]}>
              {gh.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Metric</Text>
      <View style={styles.pickerContainer}>
        {METRICS.map((metric) => (
          <Pressable
            key={metric.code}
            style={[
              styles.pickerItem,
              selectedMetric === metric.code && styles.pickerItemActive,
            ]}
            onPress={() => setSelectedMetric(metric.code)}>
            <Text
              style={[
                styles.pickerItemText,
                selectedMetric === metric.code && styles.pickerItemTextActive,
              ]}>
              {metric.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Value ({METRICS.find(m => m.code === selectedMetric)?.unit})</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Enter value"
        keyboardType="numeric"
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Measurement</Text>
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

import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, Alert } from 'react-native';

import { FarmScreen } from '@/components/ui/farm-screen';
import { FarmColors } from '@/constants/farm-theme';
import { getDemoFarmSnapshot } from '@/data/demo-farm';

const snapshot = getDemoFarmSnapshot();

export default function GreenhouseEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const greenhouse = snapshot.greenhouses.find((item) => item.id === id);

  const [name, setName] = useState(greenhouse?.name ?? '');
  const [notes, setNotes] = useState(greenhouse?.notes ?? '');

  if (!greenhouse) {
    return (
      <FarmScreen edges={['left', 'right']}>
        <Text style={styles.title}>Greenhouse not found</Text>
      </FarmScreen>
    );
  }

  const handleSave = () => {
    Alert.alert(
      'Demo Mode',
      'Changes are not saved in this demo version. In a real app, this would update the database.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <FarmScreen edges={['left', 'right']}>
      <Stack.Screen options={{ title: 'Edit Greenhouse' }} />

      <Text style={styles.label}>Greenhouse Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter greenhouse name"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter notes (e.g., equipment, structure type)"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.infoText}>
        Growing method: {greenhouse.growingMethod} (Cannot be changed in this demo)
      </Text>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: FarmColors.title,
    marginTop: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: FarmColors.title,
    marginBottom: 8,
    marginTop: 16,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  infoText: {
    fontSize: 13,
    color: FarmColors.muted,
    marginTop: 16,
    fontStyle: 'italic',
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

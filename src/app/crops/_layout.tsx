import { Stack } from 'expo-router';

import { FarmColors } from '@/constants/farm-theme';

export default function CropsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: FarmColors.accent,
        headerTitleStyle: { color: FarmColors.title, fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: FarmColors.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Crops' }} />
      <Stack.Screen name="[id]" options={{ title: 'Growing guide' }} />
    </Stack>
  );
}

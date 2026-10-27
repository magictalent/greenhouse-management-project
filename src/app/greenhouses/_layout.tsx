import { Stack } from 'expo-router';

import { FarmColors } from '@/constants/farm-theme';

export default function GreenhousesLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: FarmColors.accent,
        headerTitleStyle: { color: FarmColors.title, fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: FarmColors.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Greenhouses' }} />
      <Stack.Screen name="[id]" options={{ title: 'Greenhouse' }} />
    </Stack>
  );
}

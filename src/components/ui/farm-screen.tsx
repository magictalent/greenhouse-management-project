import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { BottomTabInset } from '@/constants/theme';
import { FarmColors } from '@/constants/farm-theme';

type FarmScreenProps = {
  children: ReactNode;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
};

export function FarmScreen({
  children,
  edges = ['top', 'left', 'right'],
}: FarmScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View collapsable={false} style={styles.fill}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(400)}>
            {children}
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: FarmColors.background,
  },
  fill: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: BottomTabInset + 36,
  },
});

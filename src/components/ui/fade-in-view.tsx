import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn, Layout } from 'react-native-reanimated';

type FadeInViewProps = {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
  duration?: number;
  style?: ViewStyle;
};

export function FadeInView({
  children,
  delay = 0,
  direction = 'down',
  duration = 500,
  style,
}: FadeInViewProps) {
  let animation = FadeIn;

  if (direction === 'down') {
    animation = FadeInDown;
  } else if (direction === 'up') {
    animation = FadeInUp;
  }

  return (
    <Animated.View
      entering={animation.delay(delay).duration(duration)}
      layout={Layout.springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

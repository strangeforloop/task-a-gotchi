import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  ink?: string;
}

export function HeartsBurst({ visible }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.overlay} pointerEvents="none">
      {/* TODO: Animated hearts floating upward using react-native-reanimated */}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 5 },
});

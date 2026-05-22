import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  ink?: string;
}

export function FoodBowl({ visible }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.overlay} pointerEvents="none">
      {/* TODO: Animated food bowl pop using react-native-reanimated */}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 60, alignItems: 'center', zIndex: 5 },
});

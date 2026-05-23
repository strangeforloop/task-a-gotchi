import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message: string;
  visible: boolean;
}

export function MessageToast({ message, visible }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.bubble}>
        <Text style={styles.text}>{message}</Text>
        <View style={styles.tail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 16 },
  bubble: { backgroundColor: '#1F2410', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, maxWidth: 280, alignItems: 'center' },
  text: { color: '#E8E7D8', fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16, fontFamily: 'monospace' },
  tail: { position: 'absolute', top: -6, width: 12, height: 12, backgroundColor: '#1F2410', transform: [{ rotate: '45deg' }], borderRadius: 2 },
});

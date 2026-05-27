import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title?: string;
  level?: number;
  subtitle?: string;
}

export function DeviceHeader({
  title = 'TASK-O-GOTCHI',
  level = 3,
  subtitle = 'POCKET PAL',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>◆ {title} ◆</Text>
      <Text style={styles.sub}>
        LV.{String(level).padStart(2, '0')} · {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 2 },
  title: {
    fontSize: 10,
    color: 'rgba(60,38,8,0.75)',
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
  },
  sub: {
    fontSize: 8,
    color: 'rgba(60,38,8,0.5)',
    fontFamily: 'monospace',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

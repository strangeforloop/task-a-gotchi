import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title?: string;
  level?: number;
  subtitle?: string;
}

export function DeviceHeader({ title = 'TASK-O-GOTCHI', level = 3, subtitle = 'POCKET PAL' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>◆ {title} ◆</Text>
      <Text style={styles.sub}>LV.{String(level).padStart(2, '0')} · {subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  title: { fontSize: 9, color: '#aaa', fontFamily: 'monospace' },
  sub: { fontSize: 9, color: '#aaa', fontFamily: 'monospace' },
});

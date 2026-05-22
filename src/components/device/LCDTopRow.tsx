import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  overdueCount: number;
}

export function LCDTopRow({ overdueCount }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.glyph}>♥{overdueCount > 0 ? overdueCount : ''}</Text>
      <Text style={styles.glyph}>⚡</Text>
      <Text style={styles.glyph}>🍜</Text>
      <Text style={styles.glyph}>⚑</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  glyph: { fontSize: 10, color: '#1F2410' },
});

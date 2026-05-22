import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  hp: number;
  en: number;
  fc: number;
}

function SegBar({ label, value, segs }: { label: string; value: number; segs: number }) {
  const filled = Math.round((value / 100) * segs);
  return (
    <View style={styles.bar}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.segments}>
        {Array.from({ length: segs }, (_, i) => (
          <View key={i} style={[styles.seg, i < filled && styles.segFilled]} />
        ))}
      </View>
    </View>
  );
}

export function LCDStatBars({ hp, en, fc }: Props) {
  return (
    <View style={styles.row}>
      <SegBar label="HP" value={hp} segs={11} />
      <SegBar label="EN" value={en} segs={9} />
      <SegBar label="FC" value={fc} segs={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  label: { fontSize: 8, color: '#1F2410', fontFamily: 'monospace', fontWeight: '800' },
  segments: { flexDirection: 'row', gap: 1 },
  seg: { width: 5, height: 8, borderWidth: 1, borderColor: '#1F2410' },
  segFilled: { backgroundColor: '#1F2410' },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PixelGlyph } from './PixelGlyph';

interface Props {
  overdueCount: number;
}

export function LCDTopRow({ overdueCount }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        <PixelGlyph name="heart" scale={2} />
        {overdueCount > 0 && <Text style={styles.count}>{overdueCount}</Text>}
      </View>
      <PixelGlyph name="bolt" scale={2} />
      <PixelGlyph name="bowl" scale={2} />
      <PixelGlyph name="flag" scale={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 4 },
  cell: { flexDirection: 'row', alignItems: 'flex-start', gap: 2 },
  count: { fontSize: 8, color: '#1F2410', fontFamily: 'monospace', fontWeight: '800', lineHeight: 10 },
});

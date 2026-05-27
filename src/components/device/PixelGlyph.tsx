import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { GlyphName } from '../../types';
import { GLYPHS, LCD_INK } from '../../constants/colors';

interface Props {
  name: GlyphName;
  color?: string;
  scale?: number;
}

export function PixelGlyph({ name, color = LCD_INK, scale = 2 }: Props) {
  const rows = GLYPHS[name];
  if (!rows) return null;
  const W = rows[0].length * scale;
  const H = rows.length * scale;
  return (
    <View style={[styles.grid, { width: W, height: H }]}>
      {rows.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.split('').map((ch, x) => (
            <View
              key={x}
              style={{
                width: scale,
                height: scale,
                backgroundColor: ch === '#' ? color : 'transparent',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
});

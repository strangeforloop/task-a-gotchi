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
  return (
    <View style={styles.container}>
      {rows.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.split('').map((ch, x) => (
            <View
              key={x}
              style={{ width: scale, height: scale, backgroundColor: ch === '#' ? color : 'transparent' }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
});

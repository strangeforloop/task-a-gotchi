import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PixelGlyph } from './PixelGlyph';
import type { GlyphName } from '../../types';

interface Props {
  hp: number;
  en: number;
  fc: number;
}

function StatIcon({ glyph, value }: { glyph: GlyphName; value: number }) {
  return (
    <View style={styles.stat}>
      <PixelGlyph name={glyph} scale={2} />
      <Text style={styles.val}>{String(value).padStart(3, '0')}</Text>
    </View>
  );
}

export function LCDStatBars({ hp, en, fc }: Props) {
  return (
    <View style={styles.row}>
      <StatIcon glyph="check" value={hp} />
      <StatIcon glyph="pie" value={en} />
      <StatIcon glyph="dot" value={fc} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  val: {
    fontSize: 8,
    color: '#1F2410',
    fontFamily: 'monospace',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

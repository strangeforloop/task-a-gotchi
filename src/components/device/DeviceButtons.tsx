import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BUTTON_DEFINITIONS } from '../../constants/colors';
import { PixelGlyph } from './PixelGlyph';

interface Props {
  onA: () => void;
  onB: () => void;
  onC: () => void;
}

export function DeviceButtons({ onA, onB, onC }: Props) {
  const handlers = { a: onA, b: onB, c: onC };

  return (
    <View style={styles.row}>
      {BUTTON_DEFINITIONS.map(btn => (
        <View key={btn.id} style={styles.col}>
          <Pressable
            onPress={handlers[btn.id]}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: btn.color },
              pressed && styles.btnPressed,
            ]}
          >
            {btn.glyph ? (
              <PixelGlyph name={btn.glyph} color="rgba(255,255,255,0.95)" scale={3} />
            ) : (
              <Text style={styles.btnLabel}>{btn.label}</Text>
            )}
          </Pressable>
          <Text style={styles.sub}>{btn.sub}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 30 },
  col: { alignItems: 'center', gap: 6 },
  btn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnPressed: { opacity: 0.7, transform: [{ scale: 0.93 }] },
  btnLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: 'monospace',
  },
  sub: { fontSize: 10, color: 'rgba(60,40,10,0.45)', fontFamily: 'monospace', fontWeight: '700' },
});

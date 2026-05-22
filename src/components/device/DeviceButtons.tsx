import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BUTTON_DEFINITIONS } from '../../constants/colors';

interface Props {
  onA: () => void;
  onB: () => void;
  onC: () => void;
}

export function DeviceButtons({ onA, onB, onC }: Props) {
  const [pressed, setPressed] = useState<string | null>(null);
  const handlers = { a: onA, b: onB, c: onC };

  return (
    <View style={styles.row}>
      {BUTTON_DEFINITIONS.map(btn => (
        <View key={btn.id} style={styles.col}>
          <Pressable
            onPressIn={() => setPressed(btn.id)}
            onPressOut={() => setPressed(null)}
            onPress={handlers[btn.id]}
            style={[styles.btn, { backgroundColor: btn.color }, pressed === btn.id && styles.btnPressed]}
          >
            <Text style={styles.btnLabel}>{btn.label}</Text>
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
  btnPressed: { opacity: 0.8 },
  btnLabel: { fontSize: 16, fontWeight: '800', color: 'rgba(255,255,255,0.95)', fontFamily: 'monospace' },
  sub: { fontSize: 10, color: 'rgba(60,40,10,0.45)', fontFamily: 'monospace', fontWeight: '700' },
});

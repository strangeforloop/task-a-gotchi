import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
  hp: number;
  deadHours: number;
  characterName: string;
  state: string;
  streak: number;
  canChoose: boolean;
  onOpenChooser: () => void;
}

const SEGS = 24;

export function HPHeader({ hp, deadHours, characterName, state, streak, canChoose, onOpenChooser }: Props) {
  const isDead = deadHours >= 48;
  const filled = Math.round((hp / 100) * SEGS);
  const barColor = hp >= 70 ? '#3B7A2C' : hp >= 45 ? '#7E7414' : hp >= 25 ? '#A85618' : '#B83524';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{characterName.toUpperCase()}</Text>
          <Text style={styles.meta}>· {state} · day {streak}</Text>
        </View>
        <Pressable onPress={onOpenChooser} disabled={!canChoose} style={styles.chooserBtn}>
          <Text style={[styles.chooserText, !canChoose && styles.chooserDisabled]}>
            {canChoose ? '↻ change' : 'lv max @ 100'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.barRow}>
        <Text style={styles.hpLabel}>HP</Text>
        <View style={styles.segments}>
          {Array.from({ length: SEGS }, (_, i) => (
            <View
              key={i}
              style={[styles.seg, { backgroundColor: i < filled ? barColor : 'rgba(60,60,67,0.10)' }]}
            />
          ))}
        </View>
        <Text style={styles.hpVal}>{isDead ? '— —' : String(hp).padStart(3, '0')}/100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 4, gap: 5 },
  topRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', fontFamily: 'monospace' },
  meta: { fontSize: 10, color: 'rgba(60,60,67,0.55)', fontFamily: 'monospace', fontWeight: '700' },
  chooserBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#1a1a1a' },
  chooserText: { fontSize: 10, fontWeight: '800', color: '#fff', fontFamily: 'monospace' },
  chooserDisabled: { color: 'rgba(60,60,67,0.4)' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hpLabel: { fontSize: 11, fontWeight: '800', color: '#1a1a1a', fontFamily: 'monospace' },
  segments: { flexDirection: 'row', flex: 1, gap: 1.5 },
  seg: { flex: 1, height: 11 },
  hpVal: { fontSize: 11, fontWeight: '800', color: '#1a1a1a', fontFamily: 'monospace', minWidth: 38, textAlign: 'right' },
});

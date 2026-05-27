import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { MenuId } from '../../types';

interface Props {
  selected: MenuId;
  onSelect: (id: MenuId) => void;
}

const ITEMS: { id: MenuId; label: string }[] = [
  { id: 'check', label: '✓' },
  { id: 'pie', label: '◔' },
  { id: 'dot', label: '●' },
];

export function LCDActionRow({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {ITEMS.map(item => (
        <TouchableOpacity key={item.id} onPress={() => onSelect(item.id)} style={styles.btn}>
          <Text style={[styles.glyph, item.id === selected && styles.active]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 14 },
  btn: { padding: 4 },
  glyph: { fontSize: 12, color: '#1F2410', opacity: 0.45 },
  active: { opacity: 1 },
});

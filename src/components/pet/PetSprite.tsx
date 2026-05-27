import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { CharacterId, PetState } from '../../types';
import { CHARACTERS, STATE_TO_TEMPLATE } from '../../constants/characters';
import { LCD_INK } from '../../constants/colors';
import { usePetAnimation } from '../../hooks/usePetAnimation';

interface Props {
  character?: CharacterId;
  state?: PetState;
  cell?: number;
  animate?: boolean;
  monochrome?: boolean;
  inkColor?: string;
}

export function PetSprite({
  character = 'blip',
  state = 'happy',
  cell = 6,
  animate = true,
  monochrome = true,
  inkColor = LCD_INK,
}: Props) {
  const { frame, displayState, opacity } = usePetAnimation(character, state, animate);

  const charDef = CHARACTERS[character] ?? CHARACTERS.blip;
  const tmplKey = (STATE_TO_TEMPLATE[displayState] ?? STATE_TO_TEMPLATE.happy).tmpl;
  const frames = charDef[tmplKey] ?? charDef.normal;
  const sprite = frames[frame % frames.length];
  const W = sprite[0].length;

  return (
    <View style={[styles.container, { opacity, width: W * cell }]}>
      {sprite.map((row, y) => (
        <View key={y} style={[styles.row, { height: cell }]}>
          {row.split('').map((ch, x) => {
            let bg: string;
            if (ch === '.') {
              bg = 'transparent';
            } else if (monochrome) {
              bg = ch === 'E' || ch === 'M' ? 'transparent' : inkColor;
            } else {
              bg = charDef.palette[ch] ?? 'transparent';
            }
            return <View key={x} style={{ width: cell, height: cell, backgroundColor: bg }} />;
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { PetState } from '../../types';

interface Props {
  state: PetState;
}

export function PetPlatform({ state }: Props) {
  return <View style={[styles.shadow, state === 'dead' && styles.dead]} />;
}

const styles = StyleSheet.create({
  shadow: { width: 70, height: 4, borderRadius: 35, backgroundColor: 'rgba(31,36,16,0.5)' },
  dead: { opacity: 0.2 },
});

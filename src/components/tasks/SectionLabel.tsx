import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  color?: string;
}

export function SectionLabel({ children, color = 'rgba(60,60,67,0.55)' }: Props) {
  return <Text style={[styles.label, { color }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

interface Props {
  children: React.ReactNode;
  palette: ColorPalette;
}

export function DeviceShell({ children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>DeviceShell</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 9, color: '#aaa' },
});

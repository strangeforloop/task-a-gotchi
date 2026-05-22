import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export function LCDScreen({ children }: Props) {
  return (
    <View style={styles.bezel}>
      <View style={styles.panel}>
        <Text style={styles.label}>LCDScreen</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bezel: { padding: 10, borderRadius: 14, backgroundColor: '#B79350' },
  panel: { borderRadius: 4, backgroundColor: '#B0BD78', padding: 8, minHeight: 200, minWidth: 200 },
  label: { fontSize: 9, color: '#1F2410', opacity: 0.4 },
});

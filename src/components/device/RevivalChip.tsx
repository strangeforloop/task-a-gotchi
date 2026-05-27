import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  revival: number;
}

export function RevivalChip({ revival }: Props) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>Revive {revival}/3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { backgroundColor: '#1F2410', paddingHorizontal: 8, paddingVertical: 3 },
  text: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B0BD78',
    letterSpacing: 1.4,
    fontFamily: 'monospace',
  },
});

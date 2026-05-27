import React from 'react';
import { View, StyleSheet } from 'react-native';

const TEAL = '#16A8CA';

interface Props {
  /** Length-7 boolean array: Mon[0] … Sun[6]. True = completed that day. */
  dots: boolean[];
}

export function HabitDots({ dots }: Props) {
  return (
    <View style={styles.row}>
      {dots.map((filled, i) => (
        <View key={i} style={[styles.dot, filled ? styles.dotFilled : styles.dotEmpty]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 5,
    marginLeft: 14, // aligns under the title (past the source dot)
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotFilled: {
    backgroundColor: TEAL,
  },
  dotEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(22,168,202,0.35)',
  },
});

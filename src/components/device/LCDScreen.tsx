import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BEZEL, BEZEL_DARK, LCD_BG } from '../../constants/colors';

interface Props {
  children: React.ReactNode;
}

export function LCDScreen({ children }: Props) {
  return (
    <View style={styles.bezel}>
      <View style={styles.panel}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bezel: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: BEZEL,
    borderWidth: 2,
    borderColor: BEZEL_DARK,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  panel: {
    borderRadius: 6,
    backgroundColor: LCD_BG,
    padding: 8,
    width: 204,
    minHeight: 180,
  },
});

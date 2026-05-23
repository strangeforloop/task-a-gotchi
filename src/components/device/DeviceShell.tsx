import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

interface Props {
  children: React.ReactNode;
  palette: ColorPalette;
}

export function DeviceShell({ children, palette }: Props) {
  return (
    <View style={styles.outer}>
      <View style={[styles.bead, { backgroundColor: palette.bodyDark }]} />
      <View
        style={[
          styles.egg,
          {
            backgroundColor: palette.body,
            borderColor: palette.bodyDark,
          },
        ]}
      >
        <View style={[styles.highlight, { backgroundColor: palette.bodyHi }]} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
  },
  bead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: -6,
    zIndex: 2,
  },
  egg: {
    width: 284,
    borderTopLeftRadius: 142,
    borderTopRightRadius: 142,
    borderBottomLeftRadius: 115,
    borderBottomRightRadius: 115,
    borderWidth: 3,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  highlight: {
    position: 'absolute',
    top: 30,
    left: 22,
    width: 44,
    height: 90,
    borderRadius: 22,
    opacity: 0.5,
    transform: [{ rotate: '-18deg' }],
  },
});

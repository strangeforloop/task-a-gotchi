import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  checked: boolean;
  color?: string;
  onPress: () => void;
}

export function CheckCircle({ checked, color = '#378ADD', onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.circle,
        {
          borderColor: checked ? color : 'rgba(60,60,67,0.22)',
          backgroundColor: checked ? color : 'transparent',
        },
      ]}
    >
      {checked && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { color: '#fff', fontSize: 13, fontWeight: '700', lineHeight: 16 },
});

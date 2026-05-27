import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  onAdd: (title: string) => void;
  onAddRecurring?: (title: string) => void;
  recurringDayLabel?: string;
  keyboard: boolean;
  setKeyboard: (open: boolean) => void;
}

export function AddBar({ onAdd, onAddRecurring, recurringDayLabel, keyboard, setKeyboard }: Props) {
  const [value, setValue] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, e =>
      setKeyboardOffset(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardOffset(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const submit = () => {
    if (!value.trim()) return;
    if (isRecurring && onAddRecurring) {
      onAddRecurring(value.trim());
    } else {
      onAdd(value.trim());
    }
    setValue('');
    setIsRecurring(false);
    setKeyboard(false);
  };

  if (keyboard) {
    const dotColor = isRecurring ? '#7F77DD' : '#1D9E75';
    const modeLabel = isRecurring
      ? recurringDayLabel ? `recurring · ${recurringDayLabel}` : 'recurring'
      : 'one-off · today';

    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={[styles.inputRow, { bottom: 50 + keyboardOffset }]}>
        <View style={styles.dotCol}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={[styles.modeLabel, { color: dotColor }]}>{modeLabel}</Text>
        </View>
        <TextInput
          autoFocus
          value={value}
          onChangeText={setValue}
          onSubmitEditing={submit}
          placeholder={isRecurring ? 'Add a recurring task…' : 'Add a task to today…'}
          style={styles.input}
          returnKeyType="done"
        />
        <Pressable onPress={submit} style={[styles.addBtn, !value.trim() && styles.addBtnDisabled]}>
          <Text style={styles.addTxt}>Add</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => { setIsRecurring(false); setKeyboard(true); }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRecurring(true);
        setKeyboard(true);
      }}
      style={styles.fab}
    >
      <Text style={styles.fabIcon}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 38,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: { fontSize: 28, color: '#fff', fontWeight: '300', lineHeight: 34 },
  inputRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
  },
  dotCol: { alignItems: 'center', gap: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  modeLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 0.2 },
  input: { flex: 1, fontSize: 16, padding: 6 },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  addBtnDisabled: { backgroundColor: 'rgba(60,60,67,0.12)' },
  addTxt: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

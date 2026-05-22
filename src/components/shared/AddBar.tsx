import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface Props {
  onAdd: (title: string) => void;
  keyboard: boolean;
  setKeyboard: (open: boolean) => void;
}

export function AddBar({ onAdd, keyboard, setKeyboard }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
    setKeyboard(false);
  };

  if (keyboard) {
    return (
      <View style={styles.inputRow}>
        <View style={styles.dot} />
        <TextInput
          autoFocus
          value={value}
          onChangeText={setValue}
          onSubmitEditing={submit}
          placeholder="Add a task to today…"
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
    <Pressable onPress={() => setKeyboard(true)} style={styles.fab}>
      <Text style={styles.fabIcon}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 20, bottom: 38, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  fabIcon: { fontSize: 28, color: '#fff', fontWeight: '300', lineHeight: 34 },
  inputRow: { position: 'absolute', left: 16, right: 16, bottom: 50, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 18, paddingVertical: 8, paddingLeft: 14, paddingRight: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1D9E75' },
  input: { flex: 1, fontSize: 16, padding: 6 },
  addBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#1a1a1a' },
  addBtnDisabled: { backgroundColor: 'rgba(60,60,67,0.12)' },
  addTxt: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

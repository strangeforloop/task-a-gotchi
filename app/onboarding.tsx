import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useHabits } from '../src/context/HabitContext';
import { useProfile } from '../src/context/ProfileContext';
import { CheckCircle } from '../src/components/tasks/CheckCircle';
import { SUGGESTED_HABITS } from '../src/constants/suggestedHabits';

const HABIT_TEAL = '#16A8CA';

export default function OnboardingScreen() {
  const router = useRouter();
  const { addHabit } = useHabits();
  const { setOnboarded } = useProfile();

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    Haptics.selectionAsync();
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const finish = (addSelected: boolean) => {
    if (addSelected) {
      SUGGESTED_HABITS.forEach((h, i) => {
        if (selected.has(i)) addHabit(h.title, h.frequency, h.daysOfWeek, h.scheduledTime);
      });
    }
    setOnboarded(true);
    router.replace('/');
  };

  const count = selected.size;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.kicker}>WELCOME</Text>
        <Text style={styles.title}>What should your pet{'\n'}help you keep up?</Text>
        <Text style={styles.subtitle}>
          Pick a few habits to start. Completing them keeps your pet healthy — you can change
          these anytime.
        </Text>

        <ScrollView style={styles.list} contentContainerStyle={styles.listInner}>
          {SUGGESTED_HABITS.map((h, i) => {
            const checked = selected.has(i);
            return (
              <Pressable
                key={h.title}
                onPress={() => toggle(i)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={h.title}
                style={[styles.row, checked && styles.rowChecked]}
              >
                <CheckCircle checked={checked} color={HABIT_TEAL} onPress={() => toggle(i)} />
                <Text style={styles.rowTitle}>{h.title}</Text>
                <Text style={styles.rowFreq}>daily</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable style={styles.startBtn} onPress={() => finish(true)}>
          <Text style={styles.startTxt}>
            {count === 0 ? 'Start with no habits' : `Start with ${count} habit${count === 1 ? '' : 's'}`}
          </Text>
        </Pressable>
        <Pressable style={styles.skipBtn} onPress={() => finish(false)} accessibilityRole="button">
          <Text style={styles.skipTxt}>Skip for now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF7F0' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(60,60,67,0.5)',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    fontFamily: 'monospace',
    lineHeight: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(60,60,67,0.7)',
    lineHeight: 19,
    marginBottom: 16,
  },
  list: { flex: 1 },
  listInner: { gap: 8, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rowChecked: { borderColor: HABIT_TEAL, backgroundColor: '#F0FAFC' },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  rowFreq: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60,60,67,0.45)',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  startBtn: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  startTxt: { fontSize: 15, fontWeight: '800', color: '#fff', fontFamily: 'monospace' },
  skipBtn: { marginTop: 8, paddingVertical: 12, alignItems: 'center' },
  skipTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(60,60,67,0.55)',
    fontFamily: 'monospace',
  },
});

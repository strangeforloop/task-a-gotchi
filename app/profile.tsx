import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import { useProfile } from '../src/context/ProfileContext';
import { useWeeklyPlan } from '../src/context/WeeklyPlanContext';
import { usePetHp } from '../src/hooks/usePetHp';
import { usePetState } from '../src/hooks/usePetState';
import { usePetMood } from '../src/hooks/usePetMood';

import { PetSprite } from '../src/components/pet/PetSprite';
import { CHARACTERS } from '../src/constants/characters';

export default function ProfileScreen() {
  const router = useRouter();
  const { character } = useProfile();
  const { tasks, streak } = useWeeklyPlan();
  // Same HP source as Home so the two screens can never disagree.
  const { hp, deadHours } = usePetHp();
  const { state, meta, barColor } = usePetState(hp, deadHours);
  const { mood } = usePetMood();

  const todayTasks = tasks.filter(t => !t.overdue);
  const doneTodayCount = todayTasks.filter(t => t.completed).length;
  const totalTodayCount = todayTasks.length;

  const charDef = CHARACTERS[character];

  return (
    <Pressable style={styles.backdrop} onPress={() => router.back()}>
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          {/* Sprite */}
          <View style={styles.spriteRow}>
            <PetSprite character={character} state={state} cell={8} monochrome animate={false} />
          </View>

          {/* Name + state */}
          <Text style={styles.charName}>{charDef.label}</Text>
          <Text style={[styles.stateLine, { color: meta.tint }]}>{meta.label}</Text>

          <View style={styles.divider} />

          {/* Stats */}
          <View style={styles.statRow}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statLabel}>HP</Text>
            <View style={styles.statBarTrack}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${hp}%` as `${number}%`, backgroundColor: barColor },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{hp}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statIcon}>💗</Text>
            <Text style={styles.statLabel}>Mood</Text>
            <View style={styles.statBarTrack}>
              <View style={[styles.statBarFill, { width: `${mood}%` as `${number}%`, backgroundColor: '#E8689B' }]} />
            </View>
            <Text style={styles.statValue}>{mood}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValueWide}>
              {streak === 0 ? 'no streak yet' : `${streak} day${streak === 1 ? '' : 's'}`}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValueWide}>
              {totalTodayCount === 0 ? 'no tasks' : `${doneTodayCount} / ${totalTodayCount}`}
            </Text>
          </View>

          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeBtnTxt}>close</Text>
          </Pressable>
        </Pressable>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFDF7',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 28,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  spriteRow: {
    marginBottom: 14,
  },
  charName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2410',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  stateLine: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    gap: 8,
  },
  statIcon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(31,36,16,0.5)',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    width: 52,
  },
  statBarTrack: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2410',
    fontFamily: 'monospace',
    width: 28,
    textAlign: 'right',
  },
  statValueWide: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2410',
    fontFamily: 'monospace',
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 12,
  },
  closeBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(31,36,16,0.55)',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

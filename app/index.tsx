import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useWeeklyPlan } from '../src/context/WeeklyPlanContext';
import { useHabits } from '../src/context/HabitContext';
import { useProfile } from '../src/context/ProfileContext';
import { usePetHp } from '../src/hooks/usePetHp';
import { useDeadStateTracker } from '../src/hooks/useDeadStateTracker';
import { usePetState } from '../src/hooks/usePetState';
import { useEffectTimer } from '../src/hooks/useEffectTimer';

import { HPHeader } from '../src/components/pet/HPHeader';
import { DeviceShell } from '../src/components/device/DeviceShell';
import { DeviceHeader } from '../src/components/device/DeviceHeader';
import { LCDScreen } from '../src/components/device/LCDScreen';
import { LCDTopRow } from '../src/components/device/LCDTopRow';
import { LCDActionRow } from '../src/components/device/LCDActionRow';
import { LCDStatBars } from '../src/components/device/LCDStatBars';
import { DeviceButtons } from '../src/components/device/DeviceButtons';
import { PetPlatform } from '../src/components/device/PetPlatform';
import { PetSprite } from '../src/components/pet/PetSprite';
import { HeartsBurst } from '../src/components/effects/HeartsBurst';
import { FoodBowl } from '../src/components/effects/FoodBowl';
import { MessageToast } from '../src/components/effects/MessageToast';
import { TaskList } from '../src/components/tasks/TaskList';
import { AddBar } from '../src/components/shared/AddBar';

import { DEVICE_PALETTES } from '../src/constants/colors';
import { pickMessage } from '../src/utils/messages';
import type { MenuId } from '../src/types';

const COLORWAY_IDS = ['butter', 'mint', 'coral', 'sky', 'ube'] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, toggleTask, addTask, addTemplate, todayId, streak } = useWeeklyPlan();
  const { habitTasks, overdueHabitTasks, toggleHabit } = useHabits();
  const { character, colorway, setColorway, onboarded, hydrated, recordInteraction } = useProfile();

  // Single source of truth for HP + dead state, shared with the profile modal.
  const { hp, deadHours } = usePetHp();
  useDeadStateTracker(hp);
  const { state, meta } = usePetState(hp, deadHours);

  // Display: overdue habits at top (red section), then today's habits, then weekly tasks
  const allTasks = useMemo(
    () => [...overdueHabitTasks, ...habitTasks, ...tasks],
    [overdueHabitTasks, habitTasks, tasks],
  );

  // Route toggles — overdue habit IDs encode the date: habit-YYYY-MM-DD-h-xxx
  const onToggle = useCallback(
    (id: string) => {
      if (id.startsWith('habit-')) {
        const rest = id.slice('habit-'.length);
        if (/^\d{4}-\d{2}-\d{2}-/.test(rest)) {
          // Overdue habit with encoded date
          const isoDate = rest.slice(0, 10); // "2026-05-26"
          const habitId = rest.slice(11); // "h-abc123"
          toggleHabit(habitId, isoDate);
        } else {
          // Today's habit: habit-h-xxx
          toggleHabit(rest);
        }
      } else {
        toggleTask(id);
      }
    },
    [toggleHabit, toggleTask],
  );
  const { effect, playEffect } = useEffectTimer();

  const [keyboard, setKeyboard] = useState(false);
  const [menu, setMenu] = useState<MenuId>('check');
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Energy is based on weekly plan tasks only (not habits), to keep it meaningful
  const DAY_LONGS: Record<string, string> = {
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
    thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
  };
  const recurringDayLabel = `every ${DAY_LONGS[todayId] ?? todayId}`;

  const todayTasks = tasks.filter(t => !t.overdue);
  const energy =
    todayTasks.length === 0
      ? 0
      : Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100);
  const focus = Math.min(100, Math.round((streak / 21) * 100));
  const overdueCount =
    tasks.filter(t => t.overdue && !t.completed).length + overdueHabitTasks.length;

  const onA = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    recordInteraction('pet');
    playEffect('purr', 1500);
  };
  const onB = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    recordInteraction('feed');
    playEffect('feed', 1700);
  };
  const onC = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    recordInteraction('talk');
    setToast({ visible: true, message: pickMessage() });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 5500);
  };

  // Hold until the persisted profile loads, then send first-time users to onboarding.
  if (!hydrated) return null;
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <HPHeader
          hp={hp}
          deadHours={deadHours}
          characterName={character}
          state={meta.label}
          streak={streak}
          canChoose={hp === 100}
          onOpenChooser={() => router.push('/character-chooser')}
        />

        <View style={styles.deviceArea}>
          <View style={styles.deviceRow}>
            <DeviceShell palette={DEVICE_PALETTES[colorway]}>
              <DeviceHeader title="TASK-O-GOTCHI" level={streak} subtitle="POCKET PAL" />
              <LCDScreen>
                <LCDTopRow overdueCount={overdueCount} />
                <View style={styles.petStage}>
                  <PetSprite character={character} state={state} cell={6} monochrome />
                  <PetPlatform state={state} />
                </View>
                <HeartsBurst visible={effect === 'purr'} />
                <FoodBowl visible={effect === 'feed'} />
                <LCDActionRow selected={menu} onSelect={setMenu} />
                <LCDStatBars hp={hp} en={energy} fc={focus} />
              </LCDScreen>
              <DeviceButtons onA={onA} onB={onB} onC={onC} />
            </DeviceShell>

            <View style={styles.colorCol}>
              {COLORWAY_IDS.map(id => (
                <Pressable
                  key={id}
                  onPress={() => setColorway(id)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: DEVICE_PALETTES[id].body },
                    colorway === id && styles.colorDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.speechSlot}>
          <MessageToast message={toast.message} visible={toast.visible} />
        </View>

        <ScrollView
          style={styles.taskScroll}
          contentContainerStyle={styles.taskContent}
          keyboardShouldPersistTaps="handled"
        >
          <TaskList tasks={allTasks} onToggle={onToggle} />
        </ScrollView>

        <Pressable onPress={() => router.push('/weekly')} style={styles.calBtn}>
          <Text style={styles.calBtnTxt}>📅</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/profile')}
          style={[styles.calBtn, styles.profileBtn]}
        >
          <Text style={styles.calBtnTxt}>👤</Text>
        </Pressable>

        <AddBar
          onAdd={addTask}
          onAddRecurring={title => addTemplate(todayId, title)}
          recurringDayLabel={recurringDayLabel}
          keyboard={keyboard}
          setKeyboard={setKeyboard}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF7F0' },
  screen: { flex: 1, backgroundColor: '#FAF7F0' },
  deviceArea: { alignItems: 'center', paddingVertical: 8 },
  deviceRow: { flexDirection: 'row', alignItems: 'center' },
  petStage: { alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' },
  speechSlot: { height: 52, justifyContent: 'center' },
  taskScroll: { flex: 1 },
  taskContent: { paddingTop: 4 },
  colorCol: { paddingLeft: 14, gap: 10 },
  colorDot: { width: 14, height: 14, borderRadius: 7 },
  colorDotActive: { borderWidth: 2.5, borderColor: '#1a1a1a' },
  calBtn: {
    position: 'absolute',
    top: 56,
    right: 18,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  calBtnTxt: { fontSize: 18, lineHeight: 22 },
  profileBtn: { right: 62 },
});

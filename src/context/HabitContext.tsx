import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DayId, Habit, HabitFrequency, HabitStore, Task } from '../types';
import {
  buildHabitDots,
  buildOverdueHabitTasks,
  computeHabitBonus,
  isHabitScheduledToday,
} from '../utils/habits';
import { computeHabitLateLabel, computeHabitLatePoints } from '../utils/format';
import { getIsoDate, getTodayDayId, getWeekStart } from '../utils/weeklyPlan';

const STORAGE_KEY = 'task-a-gotchi:habits-v1';

function buildInitialStore(): HabitStore {
  return { habits: [], completions: {} };
}

function persist(store: HabitStore) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch(() => {});
}

interface HabitContextValue {
  habits: Habit[];
  /** ISO date → habitIds completed that day. Exposed for streak/dot display. */
  completions: Record<string, string[]>;
  /** Habit tasks scheduled for today, enriched with habitId + habitDots. */
  habitTasks: Task[];
  /** Overdue habit tasks — one per habit whose last scheduled day was missed. */
  overdueHabitTasks: Task[];
  /** Total HP bonus from habits completed today (streak-multiplied). */
  habitBonus: number;
  /** HP penalty from today's habits that are past their scheduled time. */
  habitLatePenalty: number;
  /** Toggle completion for a habit on a specific date (defaults to today). */
  toggleHabit: (habitId: string, isoDate?: string) => void;
  addHabit: (
    title: string,
    frequency: HabitFrequency,
    daysOfWeek?: DayId[],
    scheduledTime?: string,
  ) => void;
  removeHabit: (habitId: string) => void;
}

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<HabitStore>(buildInitialStore);
  const [now] = useState(() => new Date());

  // Load persisted data on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      try {
        const saved: HabitStore = JSON.parse(raw);
        setStore(saved);
      } catch {
        // corrupt — use empty store
      }
    });
  }, []);

  const mutate = useCallback((updater: (s: HabitStore) => HabitStore) => {
    setStore(prev => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const todayId = getTodayDayId(now);
  const todayIso = getIsoDate(now);
  const weekStart = getWeekStart(now);

  const habitTasks = useMemo((): Task[] => {
    const completedToday = new Set(store.completions[todayIso] ?? []);
    return store.habits
      .filter(h => isHabitScheduledToday(h, todayId))
      .map(h => {
        const done = completedToday.has(h.id);
        return {
          id: `habit-${h.id}`,
          title: h.title,
          overdue: false,
          source: 'habit' as const,
          completed: done,
          habitId: h.id,
          habitDots: buildHabitDots(h.id, store.completions, weekStart),
          habitCreatedAt: h.createdAt,
          habitScheduledTime: h.scheduledTime,
          habitLateLabel:
            h.scheduledTime && !done ? computeHabitLateLabel(h.scheduledTime, now) : undefined,
        };
      });
  }, [store, todayId, todayIso, weekStart, now]);

  const overdueHabitTasks = useMemo(
    () => buildOverdueHabitTasks(store.habits, store.completions, now, weekStart),
    [store, now, weekStart],
  );

  const habitBonus = useMemo(
    () => computeHabitBonus(store.habits, store.completions, todayIso),
    [store, todayIso],
  );

  const habitLatePenalty = useMemo(() => {
    const completedToday = new Set(store.completions[todayIso] ?? []);
    let penalty = 0;
    for (const h of store.habits) {
      if (!h.scheduledTime) continue;
      if (!isHabitScheduledToday(h, todayId)) continue;
      if (completedToday.has(h.id)) continue;
      penalty += computeHabitLatePoints(h.scheduledTime, now);
    }
    return penalty;
  }, [store, todayId, todayIso, now]);

  const toggleHabit = useCallback(
    (habitId: string, isoDate: string = todayIso) => {
      mutate(s => {
        const prev = s.completions[isoDate] ?? [];
        const next = prev.includes(habitId)
          ? prev.filter(id => id !== habitId)
          : [...prev, habitId];
        return { ...s, completions: { ...s.completions, [isoDate]: next } };
      });
    },
    [mutate, todayIso],
  );

  const addHabit = useCallback(
    (title: string, frequency: HabitFrequency, daysOfWeek?: DayId[], scheduledTime?: string) => {
      if (!title.trim()) return;
      const id = 'h-' + Date.now().toString(36);
      const habit: Habit = {
        id,
        title: title.trim(),
        frequency,
        createdAt: todayIso,
        ...(frequency === 'specific-days' && daysOfWeek ? { daysOfWeek } : {}),
        ...(scheduledTime ? { scheduledTime } : {}),
      };
      mutate(s => ({ ...s, habits: [...s.habits, habit] }));
    },
    [mutate, todayIso],
  );

  const removeHabit = useCallback(
    (habitId: string) => {
      mutate(s => ({ ...s, habits: s.habits.filter(h => h.id !== habitId) }));
    },
    [mutate],
  );

  const value: HabitContextValue = {
    habits: store.habits,
    completions: store.completions,
    habitTasks,
    overdueHabitTasks,
    habitBonus,
    habitLatePenalty,
    toggleHabit,
    addHabit,
    removeHabit,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used inside HabitProvider');
  return ctx;
}

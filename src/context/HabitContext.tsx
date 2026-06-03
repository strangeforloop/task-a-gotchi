import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DayId, Habit, HabitFrequency, HabitStore, Task } from '../types';
import {
  buildHabitDots,
  buildOverdueHabitTasks,
  computeHabitBonus,
  computeHabitStreak,
  isHabitScheduledToday,
} from '../utils/habits';
import { computeHabitLateLabel, computeHabitLatePoints } from '../utils/format';
import { getIsoDate, getTodayDayId, getWeekStart } from '../utils/weeklyPlan';
import { writeStore } from '../utils/storage';
import { uid } from '../utils/id';

const STORAGE_KEY = 'task-a-gotchi:habits-v1';

function buildInitialStore(): HabitStore {
  return { habits: [], completions: {} };
}

function persist(store: HabitStore) {
  writeStore(STORAGE_KEY, store);
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
  /** Edit an existing habit's title/frequency/days/time. Preserves id + createdAt (and streak). */
  updateHabit: (
    habitId: string,
    patch: Partial<Pick<Habit, 'title' | 'frequency' | 'daysOfWeek' | 'scheduledTime'>>,
  ) => void;
  removeHabit: (habitId: string) => void;
}

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<HabitStore>(buildInitialStore);
  const [now, setNow] = useState(() => new Date());

  // Tick every 60s so habitLateLabel / habitLatePenalty stay accurate during the day.
  // This also handles midnight rollover (todayId / todayIso) within 60s.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Load persisted data on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      try {
        const saved: HabitStore = JSON.parse(raw);
        // Defensive: drop any habits sharing an id (legacy data from the old
        // Date.now() id generator could collide). Re-persist if we cleaned any.
        const seen = new Set<string>();
        const deduped = saved.habits.filter(h => {
          if (seen.has(h.id)) return false;
          seen.add(h.id);
          return true;
        });
        const next =
          deduped.length === saved.habits.length ? saved : { ...saved, habits: deduped };
        if (next !== saved) persist(next);
        setStore(next);
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
          habitStreak: computeHabitStreak(h, store.completions, todayIso),
          habitCreatedAt: h.createdAt,
          habitScheduledTime: h.scheduledTime,
          habitLateLabel: !done
            ? computeHabitLateLabel(h.scheduledTime ?? '08:00', now)
            : undefined,
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
      if (!isHabitScheduledToday(h, todayId)) continue;
      if (completedToday.has(h.id)) continue;
      penalty += computeHabitLatePoints(h.scheduledTime ?? '08:00', now);
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
      const id = uid('h');
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

  const updateHabit = useCallback(
    (
      habitId: string,
      patch: Partial<Pick<Habit, 'title' | 'frequency' | 'daysOfWeek' | 'scheduledTime'>>,
    ) => {
      mutate(s => ({
        ...s,
        habits: s.habits.map(h => {
          if (h.id !== habitId) return h;
          // Merge, then normalize: keep id/createdAt; drop daysOfWeek unless specific-days;
          // drop scheduledTime when cleared.
          const merged: Habit = { ...h, ...patch };
          if (patch.title !== undefined) merged.title = patch.title.trim() || h.title;
          if (merged.frequency !== 'specific-days') {
            delete merged.daysOfWeek;
          }
          if ('scheduledTime' in patch && !patch.scheduledTime) {
            delete merged.scheduledTime;
          }
          return merged;
        }),
      }));
    },
    [mutate],
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
    updateHabit,
    removeHabit,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used inside HabitProvider');
  return ctx;
}

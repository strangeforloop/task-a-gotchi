import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Day, DayId, DayCompletions, Task, WeeklyPlanStore, WeeklyTaskEntry } from '../types';
import { WEEKLY_TEMPLATE, WEEKLY_ONEOFFS } from '../constants/data';
import {
  computeWeekDays,
  deriveTasksForToday,
  getIsoDate,
  getTodayDayId,
  getWeekStart,
  seedOneoffs,
} from '../utils/weeklyPlan';
import { computeStreak } from '../utils/streak';

const STORAGE_KEY = 'task-a-gotchi:weekly-v2';

const DAY_IDS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function buildInitialStore(): WeeklyPlanStore {
  const weekStart = getWeekStart();
  const now = new Date();
  const todayIndex = DAY_IDS.indexOf(getTodayDayId(now));

  // Pre-complete all past days except yesterday, so the app opens with a handful
  // of overdue tasks rather than a completely clean slate.
  const oneoffs = seedOneoffs(WEEKLY_ONEOFFS as Record<string, string[]>);
  const completions: Record<string, DayCompletions> = {};

  for (let i = 0; i < todayIndex - 1; i++) {
    const dayId = DAY_IDS[i];
    const monday = new Date(weekStart + 'T00:00:00');
    monday.setDate(monday.getDate() + i);
    const iso = monday.toISOString().split('T')[0];
    const dayOneoffIds = (oneoffs[dayId] ?? []).map(e => e.id);
    completions[iso] = {
      templateTitles: [...(WEEKLY_TEMPLATE[dayId] ?? [])],
      oneoffIds: dayOneoffIds,
    };
  }
  // Yesterday and today intentionally left out → yesterday's tasks become overdue

  return {
    weekStart,
    templates: { ...WEEKLY_TEMPLATE },
    oneoffs,
    completions,
  };
}

interface WeeklyPlanContextValue {
  tasks: Task[];
  weekDays: Day[];
  todayId: DayId;
  streak: number;
  templates: Record<DayId, string[]>;
  oneoffs: Record<DayId, WeeklyTaskEntry[]>;
  toggleTask: (id: string) => void;
  addTask: (title: string) => void;
  addTemplate: (dayId: DayId, title: string) => void;
  removeTemplate: (dayId: DayId, title: string) => void;
  addOneoff: (dayId: DayId, title: string) => void;
  removeOneoff: (dayId: DayId, id: string) => void;
}

const WeeklyPlanContext = createContext<WeeklyPlanContextValue | null>(null);

function persist(store: WeeklyPlanStore) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch(() => {});
}

export function WeeklyPlanProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<WeeklyPlanStore>(buildInitialStore);
  const [now, setNow] = useState(() => new Date());

  // Re-arm at each midnight so todayId / weekStart stay current without a restart
  useEffect(() => {
    const n = new Date();
    const tomorrow = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
    const ms = tomorrow.getTime() - n.getTime();
    const timer = setTimeout(() => setNow(new Date()), ms);
    return () => clearTimeout(timer);
  }, [now]);

  // Load from AsyncStorage on mount; reset if week has rolled over
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw) return;
      try {
        const saved: WeeklyPlanStore = JSON.parse(raw);
        const currentWeekStart = getWeekStart();
        if (saved.weekStart !== currentWeekStart) {
          // New week: keep templates, reset oneoffs + completions
          const fresh: WeeklyPlanStore = {
            weekStart: currentWeekStart,
            templates: saved.templates,
            oneoffs: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
            completions: {},
          };
          setStore(fresh);
          persist(fresh);
        } else {
          setStore(saved);
        }
      } catch {
        // corrupt data — use initial
      }
    });
  }, []);

  const mutate = useCallback((updater: (s: WeeklyPlanStore) => WeeklyPlanStore) => {
    setStore(prev => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const todayId = getTodayDayId(now);
  const todayIso = getIsoDate(now);
  const weekDays = useMemo(() => computeWeekDays(store.weekStart, now), [store.weekStart, now]);
  const tasks = useMemo(() => deriveTasksForToday(store, now), [store, now]);
  const streak = useMemo(
    () => computeStreak(store.completions, todayIso),
    [store.completions, todayIso],
  );

  const toggleTask = useCallback(
    (id: string) => {
      mutate(s => {
        const completions = { ...s.completions };
        const day = { ...(completions[todayIso] ?? { templateTitles: [], oneoffIds: [] }) };

        if (id.startsWith('today-tmpl-')) {
          const title = id.slice('today-tmpl-'.length);
          day.templateTitles = day.templateTitles.includes(title)
            ? day.templateTitles.filter(t => t !== title)
            : [...day.templateTitles, title];
        } else if (id.startsWith('today-oneoff-')) {
          const oneoffId = id.slice('today-oneoff-'.length);
          day.oneoffIds = day.oneoffIds.includes(oneoffId)
            ? day.oneoffIds.filter(i => i !== oneoffId)
            : [...day.oneoffIds, oneoffId];
        }
        // Overdue tasks: toggling removes them from their original day's completions
        // For simplicity, overdue tasks can't be toggled back to incomplete once checked
        else if (id.startsWith('overdue-tmpl-')) {
          // id = overdue-tmpl-{dayId}-{title}
          const rest = id.slice('overdue-tmpl-'.length);
          const [dayId, ...titleParts] = rest.split('-');
          const title = titleParts.join('-');
          const dayIndex = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(dayId);
          if (dayIndex >= 0) {
            const dayIso = dayIsoFromStore(s.weekStart, dayIndex);
            const existing = s.completions[dayIso] ?? { templateTitles: [], oneoffIds: [] };
            completions[dayIso] = {
              ...existing,
              templateTitles: existing.templateTitles.includes(title)
                ? existing.templateTitles.filter(t => t !== title)
                : [...existing.templateTitles, title],
            };
          }
        } else if (id.startsWith('overdue-oneoff-')) {
          const oneoffId = id.slice('overdue-oneoff-'.length);
          // find which day this oneoff belongs to
          for (let i = 0; i < 7; i++) {
            const dayId = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i] as DayId;
            if ((s.oneoffs[dayId] ?? []).some(e => e.id === oneoffId)) {
              const dayIso = dayIsoFromStore(s.weekStart, i);
              const existing = s.completions[dayIso] ?? { templateTitles: [], oneoffIds: [] };
              completions[dayIso] = {
                ...existing,
                oneoffIds: existing.oneoffIds.includes(oneoffId)
                  ? existing.oneoffIds.filter(i => i !== oneoffId)
                  : [...existing.oneoffIds, oneoffId],
              };
              break;
            }
          }
        }

        completions[todayIso] = day;
        return { ...s, completions };
      });
    },
    [mutate, todayIso],
  );

  const addTask = useCallback(
    (title: string) => {
      if (!title.trim()) return;
      const id = 'oo-' + Date.now().toString(36);
      mutate(s => ({
        ...s,
        oneoffs: {
          ...s.oneoffs,
          [todayId]: [
            ...(s.oneoffs[todayId] ?? []),
            { id, title: title.trim(), createdAt: Date.now() },
          ],
        },
      }));
    },
    [mutate, todayId],
  );

  const addTemplate = useCallback(
    (dayId: DayId, title: string) => {
      if (!title.trim()) return;
      mutate(s => ({
        ...s,
        templates: {
          ...s.templates,
          [dayId]: [...(s.templates[dayId] ?? []), title.trim()],
        },
      }));
    },
    [mutate],
  );

  const removeTemplate = useCallback(
    (dayId: DayId, title: string) => {
      mutate(s => {
        const newTemplates = { ...s.templates };
        newTemplates[dayId] = (newTemplates[dayId] ?? []).filter(t => t !== title);
        // Strip the same title from all past days so their overdue instances disappear too.
        // (The same template name often spans multiple days — removing it from today's plan
        // should also clear any overdue ghost from yesterday with the same title.)
        const todayIdx = DAY_IDS.indexOf(todayId);
        for (let i = 0; i < todayIdx; i++) {
          const pd = DAY_IDS[i];
          newTemplates[pd] = (newTemplates[pd] ?? []).filter(t => t !== title);
        }
        return { ...s, templates: newTemplates };
      });
    },
    [mutate, todayId],
  );

  const addOneoff = useCallback(
    (dayId: DayId, title: string) => {
      if (!title.trim()) return;
      const id = 'oo-' + Date.now().toString(36);
      mutate(s => ({
        ...s,
        oneoffs: {
          ...s.oneoffs,
          [dayId]: [
            ...(s.oneoffs[dayId] ?? []),
            { id, title: title.trim(), createdAt: Date.now() },
          ],
        },
      }));
    },
    [mutate],
  );

  const removeOneoff = useCallback(
    (dayId: DayId, id: string) => {
      mutate(s => ({
        ...s,
        oneoffs: {
          ...s.oneoffs,
          [dayId]: (s.oneoffs[dayId] ?? []).filter(e => e.id !== id),
        },
      }));
    },
    [mutate],
  );

  const value: WeeklyPlanContextValue = {
    tasks,
    weekDays,
    todayId,
    streak,
    templates: store.templates,
    oneoffs: store.oneoffs,
    toggleTask,
    addTask,
    addTemplate,
    removeTemplate,
    addOneoff,
    removeOneoff,
  };

  return <WeeklyPlanContext.Provider value={value}>{children}</WeeklyPlanContext.Provider>;
}

export function useWeeklyPlan(): WeeklyPlanContextValue {
  const ctx = useContext(WeeklyPlanContext);
  if (!ctx) throw new Error('useWeeklyPlan must be used inside WeeklyPlanProvider');
  return ctx;
}

// Helper used internally — mirrors dayIsoFromWeekStart without importing to avoid circular
function dayIsoFromStore(weekStart: string, dayIndex: number): string {
  const monday = new Date(weekStart + 'T00:00:00');
  monday.setDate(monday.getDate() + dayIndex);
  return monday.toISOString().split('T')[0];
}

import { useMemo } from 'react';
import { useWeeklyPlan } from '../context/WeeklyPlanContext';
import { useHabits } from '../context/HabitContext';
import { useProfile } from '../context/ProfileContext';
import { useHealth } from './useHealth';
import { useNow } from './useNow';

const MS_PER_HOUR = 3_600_000;

/**
 * Single source of truth for the pet's HP and how long it has been at 0.
 *
 * Both the home screen and the profile modal use this so their HP can never
 * diverge: overdue habit penalties + habit bonus + late penalty all feed the
 * same computation. `deadHours` is derived from the persisted `hpZeroSince`
 * timestamp (see ProfileContext); the home screen owns keeping that timestamp
 * up to date (see useDeadStateTracker).
 */
export function usePetHp(): { hp: number; deadHours: number } {
  const { tasks } = useWeeklyPlan();
  const { overdueHabitTasks, habitBonus, habitLatePenalty } = useHabits();
  const { hpZeroSince } = useProfile();

  const allTasksForHp = useMemo(
    () => [...overdueHabitTasks, ...tasks],
    [overdueHabitTasks, tasks],
  );
  const hp = useHealth(allTasksForHp, habitBonus, habitLatePenalty);

  const now = useNow(60_000);
  const deadHours = hpZeroSince == null ? 0 : Math.max(0, (now - hpZeroSince) / MS_PER_HOUR);

  return { hp, deadHours };
}

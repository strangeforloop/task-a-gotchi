import type { DayId, Habit, HabitFrequency, Task } from '../types';

const DAY_IDS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const WEEKDAYS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

/** Returns true if this habit should appear in today's task list. */
export function isHabitScheduledToday(habit: Habit, todayId: DayId): boolean {
  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return WEEKDAYS.includes(todayId);
    case 'specific-days':
      return (habit.daysOfWeek ?? []).includes(todayId);
  }
}

/**
 * Counts how many consecutive days (ending on todayIso) this habit was completed.
 * Walks backwards through completions until it finds a gap.
 */
export function computeHabitStreak(
  habitId: string,
  completions: Record<string, string[]>,
  todayIso: string,
): number {
  let streak = 0;
  const cursor = new Date(todayIso + 'T00:00:00');

  for (let i = 0; i < 3650; i++) {
    const iso = cursor.toISOString().slice(0, 10);
    if (!(completions[iso] ?? []).includes(habitId)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/** HP bonus for a single habit based on its current streak. */
export function streakBonus(streak: number): number {
  if (streak >= 21) return 5;
  if (streak >= 7) return 3;
  return 1;
}

/**
 * Total HP bonus from all habits that were completed today.
 * Only habits completed on todayIso contribute.
 */
export function computeHabitBonus(
  habits: Habit[],
  completions: Record<string, string[]>,
  todayIso: string,
): number {
  const completedToday = new Set(completions[todayIso] ?? []);
  let bonus = 0;
  for (const habit of habits) {
    if (completedToday.has(habit.id)) {
      const streak = computeHabitStreak(habit.id, completions, todayIso);
      bonus += streakBonus(streak);
    }
  }
  return bonus;
}

/**
 * Returns a boolean[7] for Mon–Sun showing which days of the current week
 * this habit was completed.  `weekStart` is the Monday ISO date (YYYY-MM-DD).
 */
export function buildHabitDots(
  habitId: string,
  completions: Record<string, string[]>,
  weekStart: string,
): boolean[] {
  const monday = new Date(weekStart + 'T00:00:00');
  return DAY_IDS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return (completions[iso] ?? []).includes(habitId);
  });
}

// ─── Overdue habit helpers ────────────────────────────────────────────────────

/** Penalty scale for overdue habits. Lighter than regular tasks (max 30) but meaningful. */
export function habitPointsForHours(hours: number): number {
  if (hours < 6) return 0;
  if (hours < 12) return 15;
  return 25;
}

/** Converts a JS Date to a DayId (getDay: 0=Sun … 6=Sat → mon…sun). */
function dateToDay(date: Date): DayId {
  const MAP: DayId[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return MAP[date.getDay()];
}

const DAY_LONGS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Returns the ISO date (YYYY-MM-DD) of the most recent day before `todayIso`
 * on which this habit was scheduled, or null if none found within 7 days.
 */
export function getLastScheduledDate(habit: Habit, todayIso: string): string | null {
  const cursor = new Date(todayIso + 'T00:00:00');
  for (let i = 0; i < 7; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const iso = cursor.toISOString().slice(0, 10);
    if (isHabitScheduledToday(habit, dateToDay(cursor))) return iso;
  }
  return null;
}

/**
 * Returns a Task[] of overdue habit entries — one per habit whose most-recent
 * scheduled day was not completed.  Each task has `overdue: true` and
 * `overduePoints` set, so `computeHealth()` picks it up automatically.
 *
 * Habits already completed on their last scheduled day are excluded.
 */
export function buildOverdueHabitTasks(
  habits: Habit[],
  completions: Record<string, string[]>,
  now: Date,
  weekStart: string,
): Task[] {
  const todayIso = now.toISOString().slice(0, 10);
  const tasks: Task[] = [];

  for (const h of habits) {
    const overdueIso = getLastScheduledDate(h, todayIso);
    if (!overdueIso) continue;

    // Completed on that day → no penalty, don't show as overdue
    if ((completions[overdueIso] ?? []).includes(h.id)) continue;

    // Hours past midnight at the end of the due day
    const deadline = new Date(overdueIso + 'T00:00:00');
    deadline.setDate(deadline.getDate() + 1);
    const hours = Math.max(0, (now.getTime() - deadline.getTime()) / 3_600_000);

    const overdueDate = new Date(overdueIso + 'T00:00:00');

    tasks.push({
      id: `habit-${overdueIso}-${h.id}`,
      title: h.title,
      overdue: true,
      overdueFrom: DAY_LONGS[overdueDate.getDay()],
      dueDate: overdueIso,
      overduePoints: habitPointsForHours(hours),
      source: 'habit',
      completed: false,
      habitId: h.id,
      habitDots: buildHabitDots(h.id, completions, weekStart),
      habitCreatedAt: h.createdAt,
      habitScheduledTime: h.scheduledTime,
    });
  }

  return tasks;
}

// ─── Frequency label ──────────────────────────────────────────────────────────

/** Human-readable label for a habit frequency. */
export function frequencyLabel(freq: HabitFrequency, daysOfWeek?: DayId[]): string {
  switch (freq) {
    case 'daily':
      return 'Daily';
    case 'weekdays':
      return 'Weekdays';
    case 'specific-days': {
      if (!daysOfWeek || daysOfWeek.length === 0) return 'Specific days';
      const shorts: Record<DayId, string> = {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun',
      };
      return daysOfWeek.map(d => shorts[d]).join(', ');
    }
  }
}

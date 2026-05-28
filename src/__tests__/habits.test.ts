import {
  isHabitScheduledToday,
  computeHabitStreak,
  streakBonus,
  computeHabitBonus,
  buildHabitDots,
  habitPointsForHours,
  getLastScheduledDate,
  buildOverdueHabitTasks,
  frequencyLabel,
} from '../utils/habits';
import type { Habit } from '../types';

// Calendar reference (all dates in this file):
//   2026-05-25 = Mon, 2026-05-26 = Tue, 2026-05-27 = Wed,
//   2026-05-28 = Thu, 2026-05-29 = Fri, 2026-05-30 = Sat, 2026-05-31 = Sun

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'h-1',
    title: 'Test Habit',
    frequency: 'daily',
    createdAt: '2026-05-25',
    ...overrides,
  };
}

// ─── isHabitScheduledToday ────────────────────────────────────────────────────

describe('isHabitScheduledToday', () => {
  it('daily habit is scheduled on every day of the week', () => {
    const h = makeHabit({ frequency: 'daily' });
    for (const d of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const) {
      expect(isHabitScheduledToday(h, d)).toBe(true);
    }
  });

  it('weekdays habit is scheduled Mon–Fri', () => {
    const h = makeHabit({ frequency: 'weekdays' });
    expect(isHabitScheduledToday(h, 'mon')).toBe(true);
    expect(isHabitScheduledToday(h, 'fri')).toBe(true);
    expect(isHabitScheduledToday(h, 'sat')).toBe(false);
    expect(isHabitScheduledToday(h, 'sun')).toBe(false);
  });

  it('specific-days habit is scheduled only on listed days', () => {
    const h = makeHabit({ frequency: 'specific-days', daysOfWeek: ['mon', 'wed'] });
    expect(isHabitScheduledToday(h, 'mon')).toBe(true);
    expect(isHabitScheduledToday(h, 'wed')).toBe(true);
    expect(isHabitScheduledToday(h, 'tue')).toBe(false);
    expect(isHabitScheduledToday(h, 'fri')).toBe(false);
  });

  it('specific-days habit with empty daysOfWeek is never scheduled', () => {
    const h = makeHabit({ frequency: 'specific-days', daysOfWeek: [] });
    expect(isHabitScheduledToday(h, 'mon')).toBe(false);
  });
});

// ─── computeHabitStreak ───────────────────────────────────────────────────────

describe('computeHabitStreak', () => {
  const TODAY = '2026-05-28'; // Thursday

  it('returns 0 when habit has never been completed', () => {
    expect(computeHabitStreak('h-1', {}, TODAY)).toBe(0);
  });

  it('returns 0 when habit is completed on past days but not today', () => {
    const completions = { '2026-05-27': ['h-1'] };
    expect(computeHabitStreak('h-1', completions, TODAY)).toBe(0);
  });

  it('returns 1 when completed only today', () => {
    const completions = { '2026-05-28': ['h-1'] };
    expect(computeHabitStreak('h-1', completions, TODAY)).toBe(1);
  });

  it('returns the full streak length for consecutive days ending today', () => {
    const completions = {
      '2026-05-26': ['h-1'], // Tue
      '2026-05-27': ['h-1'], // Wed
      '2026-05-28': ['h-1'], // Thu
    };
    expect(computeHabitStreak('h-1', completions, TODAY)).toBe(3);
  });

  it('stops counting at a gap in completions', () => {
    const completions = {
      '2026-05-25': ['h-1'], // Mon — separated by gap
      '2026-05-27': ['h-1'], // Wed
      '2026-05-28': ['h-1'], // Thu
    };
    // Streak is 2 (Wed + Thu); Mon is before the gap (Tue missing)
    expect(computeHabitStreak('h-1', completions, TODAY)).toBe(2);
  });
});

// ─── streakBonus ─────────────────────────────────────────────────────────────

describe('streakBonus', () => {
  it('returns 1 for streaks below 7', () => {
    expect(streakBonus(0)).toBe(1);
    expect(streakBonus(1)).toBe(1);
    expect(streakBonus(6)).toBe(1);
  });

  it('returns 3 for streaks 7–20', () => {
    expect(streakBonus(7)).toBe(3);
    expect(streakBonus(14)).toBe(3);
    expect(streakBonus(20)).toBe(3);
  });

  it('returns 5 for streaks 21 and above', () => {
    expect(streakBonus(21)).toBe(5);
    expect(streakBonus(100)).toBe(5);
  });
});

// ─── computeHabitBonus ───────────────────────────────────────────────────────

describe('computeHabitBonus', () => {
  const TODAY = '2026-05-28';
  const h1 = makeHabit({ id: 'h-1' });
  const h2 = makeHabit({ id: 'h-2' });

  it('returns 0 when no habits are completed today', () => {
    expect(computeHabitBonus([h1], {}, TODAY)).toBe(0);
  });

  it('returns 1 for a single habit completed today (streak = 1)', () => {
    const completions = { [TODAY]: ['h-1'] };
    expect(computeHabitBonus([h1], completions, TODAY)).toBe(1);
  });

  it('sums bonuses across multiple habits completed today', () => {
    const completions = { [TODAY]: ['h-1', 'h-2'] };
    // both have streak 1 → 1 + 1 = 2
    expect(computeHabitBonus([h1, h2], completions, TODAY)).toBe(2);
  });

  it('applies higher streak bonus when streak is 7+', () => {
    // Build a 7-day streak for h-1
    const completions: Record<string, string[]> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date('2026-05-28T00:00:00');
      d.setDate(d.getDate() - i);
      completions[d.toISOString().slice(0, 10)] = ['h-1'];
    }
    expect(computeHabitBonus([h1], completions, TODAY)).toBe(3);
  });
});

// ─── buildHabitDots ──────────────────────────────────────────────────────────

describe('buildHabitDots', () => {
  const WEEK_START = '2026-05-25'; // Monday

  it('returns all false when there are no completions', () => {
    expect(buildHabitDots('h-1', {}, WEEK_START)).toEqual(
      [false, false, false, false, false, false, false],
    );
  });

  it('marks only Tuesday (index 1) when completed on 2026-05-26', () => {
    const completions = { '2026-05-26': ['h-1'] };
    expect(buildHabitDots('h-1', completions, WEEK_START)).toEqual(
      [false, true, false, false, false, false, false],
    );
  });

  it('marks multiple completed days across the week', () => {
    const completions = {
      '2026-05-25': ['h-1'], // Mon → index 0
      '2026-05-27': ['h-1'], // Wed → index 2
      '2026-05-29': ['h-1'], // Fri → index 4
    };
    expect(buildHabitDots('h-1', completions, WEEK_START)).toEqual(
      [true, false, true, false, true, false, false],
    );
  });

  it('ignores completions for other habits', () => {
    const completions = { '2026-05-25': ['h-other'] };
    expect(buildHabitDots('h-1', completions, WEEK_START)).toEqual(
      [false, false, false, false, false, false, false],
    );
  });
});

// ─── habitPointsForHours ─────────────────────────────────────────────────────

describe('habitPointsForHours', () => {
  it('returns 0 within the 6-hour grace period', () => {
    expect(habitPointsForHours(0)).toBe(0);
    expect(habitPointsForHours(3)).toBe(0);
    expect(habitPointsForHours(5.9)).toBe(0);
  });

  it('returns 15 from 6 hours up to (but not including) 12 hours', () => {
    expect(habitPointsForHours(6)).toBe(15);
    expect(habitPointsForHours(9)).toBe(15);
    expect(habitPointsForHours(11.9)).toBe(15);
  });

  it('returns 25 at 12 hours or more', () => {
    expect(habitPointsForHours(12)).toBe(25);
    expect(habitPointsForHours(24)).toBe(25);
    expect(habitPointsForHours(48)).toBe(25);
  });
});

// ─── getLastScheduledDate ─────────────────────────────────────────────────────

describe('getLastScheduledDate', () => {
  // Today = Thursday 2026-05-28

  it('returns yesterday for a daily habit', () => {
    const h = makeHabit({ frequency: 'daily' });
    expect(getLastScheduledDate(h, '2026-05-28')).toBe('2026-05-27');
  });

  it('returns the previous day (Wednesday) for a weekdays habit on Thursday', () => {
    const h = makeHabit({ frequency: 'weekdays' });
    expect(getLastScheduledDate(h, '2026-05-28')).toBe('2026-05-27');
  });

  it('skips the weekend and returns Friday for a weekdays habit on Monday', () => {
    const h = makeHabit({ frequency: 'weekdays' });
    // 2026-06-01 = Monday → should walk back Sun, Sat, then Fri
    expect(getLastScheduledDate(h, '2026-06-01')).toBe('2026-05-29');
  });

  it('returns null for a specific-days habit with no scheduled days', () => {
    const h = makeHabit({ frequency: 'specific-days', daysOfWeek: [] });
    expect(getLastScheduledDate(h, '2026-05-28')).toBeNull();
  });

  it('finds the correct day for a specific-days habit', () => {
    // Thursday habit, today is Thursday → last Thursday was 7 days ago
    const h = makeHabit({ frequency: 'specific-days', daysOfWeek: ['thu'] });
    expect(getLastScheduledDate(h, '2026-05-28')).toBe('2026-05-21');
  });
});

// ─── buildOverdueHabitTasks ──────────────────────────────────────────────────

describe('buildOverdueHabitTasks', () => {
  // now = Thursday 2026-05-28 10:00 → 10h past midnight (deadline was 00:00 on 28th)
  const NOW = new Date('2026-05-28T10:00:00');
  const WEEK_START = '2026-05-25';

  it('returns an overdue task for a daily habit not completed yesterday', () => {
    const habit = makeHabit({ id: 'h-1', frequency: 'daily' });
    const tasks = buildOverdueHabitTasks([habit], {}, NOW, WEEK_START);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('habit-2026-05-27-h-1');
    expect(tasks[0].overdue).toBe(true);
    expect(tasks[0].overduePoints).toBe(15); // 10h → tier 6–12h → 15
    expect(tasks[0].dueDate).toBe('2026-05-27');
  });

  it('returns nothing when the habit was completed yesterday', () => {
    const habit = makeHabit({ id: 'h-1', frequency: 'daily' });
    const completions = { '2026-05-27': ['h-1'] };
    const tasks = buildOverdueHabitTasks([habit], completions, NOW, WEEK_START);
    expect(tasks).toHaveLength(0);
  });

  it('assigns 0 overduePoints within the grace period (< 6h)', () => {
    // now = 2026-05-28 03:00 → 3h past midnight
    const earlyNow = new Date('2026-05-28T03:00:00');
    const habit = makeHabit({ id: 'h-1', frequency: 'daily' });
    const tasks = buildOverdueHabitTasks([habit], {}, earlyNow, WEEK_START);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].overduePoints).toBe(0);
  });
});

// ─── frequencyLabel ──────────────────────────────────────────────────────────

describe('frequencyLabel', () => {
  it('returns "Daily" for daily frequency', () => {
    expect(frequencyLabel('daily')).toBe('Daily');
  });

  it('returns "Weekdays" for weekdays frequency', () => {
    expect(frequencyLabel('weekdays')).toBe('Weekdays');
  });

  it('returns abbreviated day names for specific-days', () => {
    expect(frequencyLabel('specific-days', ['mon', 'wed', 'fri'])).toBe('Mon, Wed, Fri');
  });

  it('returns "Specific days" when daysOfWeek is empty', () => {
    expect(frequencyLabel('specific-days', [])).toBe('Specific days');
  });

  it('returns "Specific days" when daysOfWeek is undefined', () => {
    expect(frequencyLabel('specific-days', undefined)).toBe('Specific days');
  });
});

import type { DayId, HabitFrequency } from '../types';

export interface SuggestedHabit {
  title: string;
  frequency: HabitFrequency;
  daysOfWeek?: DayId[];
  /** Left undefined on purpose: a first-run habit with no scheduled time can't
   *  be "late," so HP stays at 100 right after onboarding. Users add times later
   *  in the Habits tab. */
  scheduledTime?: string;
}

/** Curated habits offered on first launch. All daily, none time-bound. */
export const SUGGESTED_HABITS: SuggestedHabit[] = [
  { title: 'Brush teeth', frequency: 'daily' },
  { title: 'Drink water', frequency: 'daily' },
  { title: 'Make bed', frequency: 'daily' },
  { title: 'Move 20 min', frequency: 'daily' },
  { title: 'Read', frequency: 'daily' },
  { title: 'Tidy up', frequency: 'daily' },
];

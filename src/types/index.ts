export type PetState = 'thriving' | 'happy' | 'neutral' | 'anxious' | 'sick' | 'dead';
export type CharacterId = 'blip' | 'buni' | 'nova';
export type ColorwayId = 'butter' | 'mint' | 'coral' | 'sky' | 'ube';
export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type MenuId = 'check' | 'pie' | 'dot';
export type TaskSource = 'template' | 'one-off' | 'habit';
export type HabitFrequency = 'daily' | 'weekdays' | 'specific-days';
export type EffectKind = 'purr' | 'feed';
export type GlyphName = 'heart' | 'bolt' | 'bowl' | 'flag' | 'check' | 'pie' | 'dot' | 'zzz';

export interface Task {
  id: string;
  title: string;
  overdue: boolean;
  overdueFrom?: string;
  dueDate?: string; // ISO date (YYYY-MM-DD) of the day the task was assigned
  overduePoints?: number;
  source: TaskSource;
  completed: boolean;
  createdAt?: number; // unix ms — set for one-off tasks only
  habitId?: string; // set when source === 'habit'
  habitDots?: boolean[]; // length 7 (Mon–Sun), pre-computed week completion chain
  habitCreatedAt?: string; // ISO date the habit was created, for "started Xd ago"
  habitScheduledTime?: string; // "HH:MM" for time badge display
  habitLateLabel?: string; // "2h late" soft nudge when past scheduled time + not done
}

export interface Habit {
  id: string;
  title: string;
  frequency: HabitFrequency;
  daysOfWeek?: DayId[]; // only used when frequency === 'specific-days'
  createdAt: string; // ISO date
  scheduledTime?: string; // optional "HH:MM" 24h, e.g. "08:00"
}

export interface HabitStore {
  habits: Habit[];
  /** ISO date → array of habit IDs completed that day. Never resets. */
  completions: Record<string, string[]>;
}

export interface ColorPalette {
  body: string;
  bodyDark: string;
  bodyHi: string;
}

export interface StateMeta {
  label: string;
  subtitle: string;
  tint: string;
  accent: string;
}

export interface CharacterDef {
  label: string;
  blurb: string;
  palette: Record<string, string>;
  normal: string[][];
  worried: string[][];
  sick: string[][];
  dead: string[][];
}

export interface StateTemplate {
  tmpl: 'normal' | 'worried' | 'sick' | 'dead';
  interval: number;
}

export interface Day {
  id: DayId;
  short: string;
  long: string;
  num: number;
  today?: boolean;
}

export interface ButtonDef {
  id: 'a' | 'b' | 'c';
  label: string;
  sub: string;
  color: string;
  dark: string;
  glyph?: GlyphName;
}

export interface Toast {
  visible: boolean;
  message: string;
}

export interface WeeklyTaskEntry {
  id: string;
  title: string;
  createdAt?: number; // unix ms — set when the task is added by the user
}

export interface DayCompletions {
  templateTitles: string[];
  oneoffIds: string[];
}

export interface WeeklyPlanStore {
  weekStart: string;
  templates: Record<DayId, string[]>;
  oneoffs: Record<DayId, WeeklyTaskEntry[]>;
  completions: Record<string, DayCompletions>;
}

export interface ProfileStore {
  character: CharacterId;
  colorway: ColorwayId;
  /** Unix ms when HP first reached 0, or null when alive. Drives the dead state. */
  hpZeroSince?: number | null;
  /** True once the user has completed (or skipped) first-run onboarding. */
  onboarded?: boolean;
  /** Affinity 0–100 (the fun layer; not tied to survival). */
  mood?: number;
  /** Unix ms the mood was last changed — used to decay it over time. */
  moodUpdatedAt?: number;
  /** Tasks completed toward reviving a ghost (0..REVIVE_GOAL). */
  reviveProgress?: number;
}

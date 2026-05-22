export type PetState = 'thriving' | 'happy' | 'neutral' | 'anxious' | 'sick' | 'dead';
export type CharacterId = 'blip' | 'buni' | 'nova';
export type ColorwayId = 'butter' | 'mint' | 'coral' | 'sky' | 'ube';
export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type MenuId = 'check' | 'pie' | 'dot';
export type TaskSource = 'template' | 'one-off';
export type EffectKind = 'purr' | 'feed';
export type GlyphName = 'heart' | 'bolt' | 'bowl' | 'flag' | 'check' | 'pie' | 'dot' | 'zzz';

export interface Task {
  id: string;
  title: string;
  overdue: boolean;
  overdueFrom?: string;
  overduePoints?: number;
  source: TaskSource;
  completed: boolean;
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
}

export interface Toast {
  visible: boolean;
  message: string;
}

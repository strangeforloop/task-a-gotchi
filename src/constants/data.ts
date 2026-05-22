import type { Task, StateMeta, PetState, Day, DayId } from '../types';

export const INITIAL_TASKS: Task[] = [
  { id: 'o1', title: 'Reply to Sam about Q2 budget', overdue: true, overdueFrom: 'Monday',    overduePoints: 25, source: 'template', completed: false },
  { id: 'o2', title: 'Submit expense report',         overdue: true, overdueFrom: 'Tuesday',   overduePoints: 20, source: 'one-off',  completed: false },
  { id: 'o3', title: 'Water plants',                  overdue: true, overdueFrom: 'Wednesday', overduePoints: 15, source: 'template', completed: false },
  { id: 't1', title: 'Morning run',                   overdue: false, source: 'template', completed: true  },
  { id: 't2', title: 'Stand-up @ 9:30',               overdue: false, source: 'template', completed: true  },
  { id: 't3', title: 'Therapy',                       overdue: false, source: 'template', completed: false },
  { id: 't4', title: 'Cook dinner',                   overdue: false, source: 'template', completed: false },
  { id: 't5', title: 'Read 20 pages',                 overdue: false, source: 'template', completed: false },
  { id: 't6', title: 'Buy birthday card for Jules',   overdue: false, source: 'one-off',  completed: false },
];

export const STATE_META: Record<PetState, StateMeta> = {
  thriving: { label: 'Thriving', subtitle: 'Your pet is glowing.', tint: '#FFF6E0', accent: '#46A65A' },
  happy:    { label: 'Happy',    subtitle: 'Cruising along.',       tint: '#FFF6E0', accent: '#D9A82E' },
  neutral:  { label: 'Neutral',  subtitle: 'Backlog is building.',  tint: '#F1EFE6', accent: '#7E7E69' },
  anxious:  { label: 'Anxious',  subtitle: 'Pet is worried.',       tint: '#FBEDE3', accent: '#D85A30' },
  sick:     { label: 'Sick',     subtitle: 'Pet needs help.',       tint: '#ECEFE6', accent: '#5A6F5A' },
  dead:     { label: 'Ghost',    subtitle: '3 tasks to revive.',    tint: '#EEECF2', accent: '#7F77DD' },
};

export const DAYS: Day[] = [
  { id: 'mon', short: 'Mon', long: 'Monday',    num: 21 },
  { id: 'tue', short: 'Tue', long: 'Tuesday',   num: 22 },
  { id: 'wed', short: 'Wed', long: 'Wednesday', num: 23, today: true },
  { id: 'thu', short: 'Thu', long: 'Thursday',  num: 24 },
  { id: 'fri', short: 'Fri', long: 'Friday',    num: 25 },
  { id: 'sat', short: 'Sat', long: 'Saturday',  num: 26 },
  { id: 'sun', short: 'Sun', long: 'Sunday',    num: 27 },
];

export const WEEKLY_TEMPLATE: Record<DayId, string[]> = {
  mon: ['Morning run', 'Stand-up @ 9:30', 'Water plants', 'Read 20 pages'],
  tue: ['Therapy', 'Stand-up @ 9:30', 'Cook dinner', 'Read 20 pages'],
  wed: ['Morning run', 'Stand-up @ 9:30', 'Cook dinner', 'Read 20 pages', 'Laundry'],
  thu: ['Therapy', 'Stand-up @ 9:30', 'Water plants', 'Read 20 pages'],
  fri: ['Morning run', 'Stand-up @ 9:30', 'Grocery run', 'Read 20 pages'],
  sat: ['Long run', 'Call Mom', 'Clean kitchen'],
  sun: ['Meal prep', 'Reset journal', 'Plan the week'],
};

export const WEEKLY_ONEOFFS: Partial<Record<DayId, string[]>> = {
  thu: ['Buy birthday card for Jules'],
  fri: ['Pick up dry cleaning', 'Submit Q2 budget'],
  sat: ["Aram's wedding 4pm"],
};

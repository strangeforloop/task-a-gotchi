import type { StateMeta, PetState, DayId } from '../types';

export const STATE_META: Record<PetState, StateMeta> = {
  thriving: {
    label: 'Thriving',
    subtitle: 'Your pet is glowing.',
    tint: '#FFF6E0',
    accent: '#46A65A',
  },
  happy: { label: 'Happy', subtitle: 'Cruising along.', tint: '#FFF6E0', accent: '#D9A82E' },
  neutral: {
    label: 'Neutral',
    subtitle: 'Backlog is building.',
    tint: '#F1EFE6',
    accent: '#7E7E69',
  },
  anxious: { label: 'Anxious', subtitle: 'Pet is worried.', tint: '#FBEDE3', accent: '#D85A30' },
  sick: { label: 'Sick', subtitle: 'Pet needs help.', tint: '#ECEFE6', accent: '#5A6F5A' },
  dead: { label: 'Ghost', subtitle: '3 tasks to revive.', tint: '#EEECF2', accent: '#7F77DD' },
};

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

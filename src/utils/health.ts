import type { Task, PetState } from '../types';

export function computeHealth(tasks: Task[]): number {
  const overdue = tasks.filter(t => t.overdue && !t.completed);
  const penalty = overdue.reduce((sum, t) => sum + (t.overduePoints ?? 0), 0);
  const today = tasks.filter(t => !t.overdue);
  const bonus = today.length > 0 && today.every(t => t.completed) ? 5 : 0;
  return Math.max(0, Math.min(100, 100 - penalty + bonus));
}

export function stateForHealth(hp: number, deadHours = 0): PetState {
  if (deadHours >= 48) return 'dead';
  if (hp >= 90) return 'thriving';
  if (hp >= 70) return 'happy';
  if (hp >= 50) return 'neutral';
  if (hp >= 25) return 'anxious';
  return 'sick';
}

export function healthBarColor(hp: number): string {
  if (hp >= 70) return '#639922';
  if (hp >= 45) return '#A8B22B';
  if (hp >= 25) return '#EF9F27';
  return '#E24B4A';
}

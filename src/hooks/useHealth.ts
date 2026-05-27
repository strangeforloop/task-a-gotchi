import { useMemo } from 'react';
import type { Task } from '../types';
import { computeHealth } from '../utils/health';

export function useHealth(tasks: Task[], habitBonus = 0, latePenalty = 0): number {
  return useMemo(
    () => Math.max(0, Math.min(100, computeHealth(tasks) + habitBonus - latePenalty)),
    [tasks, habitBonus, latePenalty],
  );
}

import { useMemo } from 'react';
import type { Task } from '../types';
import { computeHealth } from '../utils/health';

export function useHealth(tasks: Task[]): number {
  return useMemo(() => computeHealth(tasks), [tasks]);
}

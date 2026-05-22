import { useMemo } from 'react';
import type { PetState, StateMeta } from '../types';
import { stateForHealth, healthBarColor } from '../utils/health';
import { STATE_META } from '../constants/data';

interface PetStateResult {
  state: PetState;
  meta: StateMeta;
  barColor: string;
}

export function usePetState(hp: number, deadHours = 0): PetStateResult {
  return useMemo(() => {
    const state = stateForHealth(hp, deadHours);
    return {
      state,
      meta: STATE_META[state],
      barColor: healthBarColor(hp),
    };
  }, [hp, deadHours]);
}

// Revive loop: while the pet is a ghost (dead 48h), completing tasks advances a
// counter; reaching REVIVE_GOAL resurrects it. Pure + unit-tested.

export const REVIVE_GOAL = 3;

export interface ReviveResult {
  reviveProgress: number;
  resurrected: boolean;
}

/**
 * Advance the revive counter by one completed task.
 * Resurrects (and resets progress to 0) once progress + 1 reaches the goal.
 */
export function advanceRevive(progress: number): ReviveResult {
  const next = progress + 1;
  if (next >= REVIVE_GOAL) {
    return { reviveProgress: 0, resurrected: true };
  }
  return { reviveProgress: next, resurrected: false };
}

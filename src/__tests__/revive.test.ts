import { advanceRevive, REVIVE_GOAL } from '../utils/revive';

describe('advanceRevive', () => {
  it('increments progress before the goal', () => {
    expect(advanceRevive(0)).toEqual({ reviveProgress: 1, resurrected: false });
  });

  it('does not resurrect on the second task', () => {
    expect(advanceRevive(1)).toEqual({ reviveProgress: 2, resurrected: false });
  });

  it('resurrects exactly when progress + 1 reaches the goal', () => {
    expect(advanceRevive(REVIVE_GOAL - 1)).toEqual({ reviveProgress: 0, resurrected: true });
  });

  it('is idempotent past the goal (always resurrects, resets to 0)', () => {
    expect(advanceRevive(REVIVE_GOAL + 5)).toEqual({ reviveProgress: 0, resurrected: true });
  });
});

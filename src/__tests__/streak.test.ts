import { computeStreak } from '../utils/streak';
import type { DayCompletions } from '../types';

// Fixed reference date: Wednesday 2026-05-27
const TODAY = '2026-05-27';

function comp(templates: string[], oneoffs: string[] = []): DayCompletions {
  return { templateTitles: templates, oneoffIds: oneoffs };
}

describe('computeStreak', () => {
  it('returns 0 with no completions', () => {
    expect(computeStreak({}, TODAY)).toBe(0);
  });

  it('returns 0 when today has no completions', () => {
    // Only yesterday has completions — gap at today breaks streak
    expect(computeStreak({ '2026-05-26': comp(['Task A']) }, TODAY)).toBe(0);
  });

  it('counts today when it has at least one template completion', () => {
    expect(computeStreak({ [TODAY]: comp(['Task A']) }, TODAY)).toBe(1);
  });

  it('counts today when it has only oneoff completions', () => {
    expect(computeStreak({ [TODAY]: comp([], ['oo-abc']) }, TODAY)).toBe(1);
  });

  it('does not count days with empty template and oneoff arrays', () => {
    const completions = {
      [TODAY]: comp([], []), // empty — should not count
      '2026-05-26': comp(['Task A']), // would count but gap at today stops us
    };
    expect(computeStreak(completions, TODAY)).toBe(0);
  });

  it('counts consecutive days backwards from today', () => {
    const completions = {
      [TODAY]: comp(['Task A']), // day 1
      '2026-05-26': comp(['Task B']), // day 2
      '2026-05-25': comp(['Task C']), // day 3
    };
    expect(computeStreak(completions, TODAY)).toBe(3);
  });

  it('stops at the first gap day', () => {
    const completions = {
      [TODAY]: comp(['Task A']), // day 1
      '2026-05-26': comp(['Task B']), // day 2
      // 2026-05-25 missing — gap here
      '2026-05-24': comp(['Task C']), // not counted
    };
    expect(computeStreak(completions, TODAY)).toBe(2);
  });

  it('counts a long consecutive run correctly', () => {
    const completions: Record<string, DayCompletions> = {};
    const base = new Date(TODAY + 'T00:00:00');
    for (let i = 0; i < 10; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      completions[d.toISOString().slice(0, 10)] = comp([`Task ${i}`]);
    }
    expect(computeStreak(completions, TODAY)).toBe(10);
  });

  it('counts mixed template and oneoff completions as a single day', () => {
    const completions = {
      [TODAY]: comp(['Template task'], ['oo-123']),
    };
    expect(computeStreak(completions, TODAY)).toBe(1);
  });
});

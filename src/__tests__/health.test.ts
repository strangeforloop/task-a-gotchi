import { computeHealth, stateForHealth, healthBarColor } from '../utils/health';
import type { Task } from '../types';

function todayTask(completed = false): Task {
  return { id: 't1', title: 'Task', overdue: false, source: 'template', completed };
}

function overdueTask(points: number, completed = false): Task {
  return {
    id: 'o1',
    title: 'Task',
    overdue: true,
    source: 'template',
    overduePoints: points,
    completed,
  };
}

describe('computeHealth', () => {
  it('returns 100 with no tasks', () => {
    expect(computeHealth([])).toBe(100);
  });

  it('subtracts overdue penalty from 100', () => {
    expect(computeHealth([overdueTask(20)])).toBe(80);
  });

  it('sums penalties from multiple overdue tasks', () => {
    expect(computeHealth([overdueTask(10), overdueTask(15)])).toBe(75);
  });

  it('clamps at 0 and never goes negative', () => {
    const tasks = [overdueTask(30), overdueTask(30), overdueTask(30), overdueTask(30)];
    expect(computeHealth(tasks)).toBe(0);
  });

  it('never returns negative zero', () => {
    const hp = computeHealth([overdueTask(30), overdueTask(30), overdueTask(30), overdueTask(30)]);
    expect(Object.is(hp, -0)).toBe(false);
    expect(hp).toBe(0);
  });

  it('ignores completed overdue tasks regardless of their overduePoints', () => {
    expect(computeHealth([overdueTask(30, true)])).toBe(100);
  });

  it('adds +5 bonus when ALL today tasks are completed', () => {
    // 100 - 20 (penalty) + 5 (bonus) = 85
    expect(computeHealth([overdueTask(20), todayTask(true)])).toBe(85);
  });

  it('gives no bonus if any today task is incomplete', () => {
    // 100 - 0 + 0 = 100 (no bonus since one today task is incomplete)
    expect(computeHealth([todayTask(true), todayTask(false)])).toBe(100);
  });

  it('caps at 100 even with bonus and no penalty', () => {
    expect(computeHealth([todayTask(true)])).toBe(100);
  });
});

describe('stateForHealth', () => {
  it('returns "thriving" at 90+', () => {
    expect(stateForHealth(90)).toBe('thriving');
    expect(stateForHealth(100)).toBe('thriving');
  });

  it('returns "happy" at 70–89', () => {
    expect(stateForHealth(70)).toBe('happy');
    expect(stateForHealth(89)).toBe('happy');
  });

  it('returns "neutral" at 50–69', () => {
    expect(stateForHealth(50)).toBe('neutral');
    expect(stateForHealth(69)).toBe('neutral');
  });

  it('returns "anxious" at 25–49', () => {
    expect(stateForHealth(25)).toBe('anxious');
    expect(stateForHealth(49)).toBe('anxious');
  });

  it('returns "sick" at 0–24', () => {
    expect(stateForHealth(0)).toBe('sick');
    expect(stateForHealth(24)).toBe('sick');
  });

  it('returns "dead" when deadHours >= 48 regardless of HP', () => {
    expect(stateForHealth(100, 48)).toBe('dead');
    expect(stateForHealth(0, 100)).toBe('dead');
  });
});

describe('healthBarColor', () => {
  it('returns green at 70+', () => {
    expect(healthBarColor(70)).toBe('#639922');
    expect(healthBarColor(100)).toBe('#639922');
  });

  it('returns yellow-green at 45–69', () => {
    expect(healthBarColor(45)).toBe('#A8B22B');
    expect(healthBarColor(69)).toBe('#A8B22B');
  });

  it('returns orange at 25–44', () => {
    expect(healthBarColor(25)).toBe('#EF9F27');
    expect(healthBarColor(44)).toBe('#EF9F27');
  });

  it('returns red at 0–24', () => {
    expect(healthBarColor(0)).toBe('#E24B4A');
    expect(healthBarColor(24)).toBe('#E24B4A');
  });
});

import {
  getWeekStart,
  getIsoDate,
  getTodayDayId,
  computeWeekDays,
  deriveTasksForToday,
} from '../utils/weeklyPlan';
import type { WeeklyPlanStore } from '../types';

// 2026-05-25 is a Monday
const MON = new Date('2026-05-25T10:00:00');
// 2026-05-27 is a Wednesday
const WED = new Date('2026-05-27T10:00:00');
// 2026-05-31 is a Sunday
const SUN = new Date('2026-05-31T10:00:00');

const WEEK_START = '2026-05-25';

const EMPTY_STORE: WeeklyPlanStore = {
  weekStart: WEEK_START,
  templates: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
  oneoffs: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
  completions: {},
};

describe('getIsoDate', () => {
  it('formats to YYYY-MM-DD', () => {
    expect(getIsoDate(MON)).toBe('2026-05-25');
  });
});

describe('getWeekStart', () => {
  it('returns the Monday for a Wednesday', () => {
    expect(getWeekStart(WED)).toBe('2026-05-25');
  });

  it('returns the Monday for a Monday', () => {
    expect(getWeekStart(MON)).toBe('2026-05-25');
  });

  it('returns the Monday for a Sunday', () => {
    expect(getWeekStart(SUN)).toBe('2026-05-25');
  });
});

describe('getTodayDayId', () => {
  it('returns "mon" for a Monday', () => {
    expect(getTodayDayId(MON)).toBe('mon');
  });

  it('returns "wed" for a Wednesday', () => {
    expect(getTodayDayId(WED)).toBe('wed');
  });

  it('returns "sun" for a Sunday', () => {
    expect(getTodayDayId(SUN)).toBe('sun');
  });
});

describe('computeWeekDays', () => {
  it('returns 7 days starting from Monday', () => {
    const days = computeWeekDays(WEEK_START, MON);
    expect(days).toHaveLength(7);
    expect(days[0].id).toBe('mon');
    expect(days[6].id).toBe('sun');
  });

  it('marks today correctly', () => {
    const days = computeWeekDays(WEEK_START, WED);
    expect(days.find(d => d.today)?.id).toBe('wed');
  });

  it('includes correct day-of-month numbers', () => {
    const days = computeWeekDays(WEEK_START, MON);
    expect(days[0].num).toBe(25); // Mon May 25
    expect(days[6].num).toBe(31); // Sun May 31
  });
});

describe('deriveTasksForToday', () => {
  it('returns only today tasks when no prior days have tasks', () => {
    const store: WeeklyPlanStore = {
      ...EMPTY_STORE,
      templates: { ...EMPTY_STORE.templates, wed: ['Morning run', 'Read 20 pages'] },
    };
    const tasks = deriveTasksForToday(store, WED);
    expect(tasks).toHaveLength(2);
    expect(tasks.every(t => !t.overdue)).toBe(true);
  });

  it('marks incomplete prior-day template tasks as overdue', () => {
    const store: WeeklyPlanStore = {
      ...EMPTY_STORE,
      templates: { ...EMPTY_STORE.templates, mon: ['Morning run'], wed: [] },
      completions: {}, // Monday not completed
    };
    const tasks = deriveTasksForToday(store, WED);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].overdue).toBe(true);
    expect(tasks[0].overdueFrom).toBe('Monday');
    expect(tasks[0].title).toBe('Morning run');
  });

  it('keeps completed prior-day tasks in the list but marks them completed with 0 penalty', () => {
    const store: WeeklyPlanStore = {
      ...EMPTY_STORE,
      templates: { ...EMPTY_STORE.templates, mon: ['Morning run'] },
      completions: {
        '2026-05-25': { templateTitles: ['Morning run'], oneoffIds: [] },
      },
    };
    const tasks = deriveTasksForToday(store, WED);
    const task = tasks.find(t => t.title === 'Morning run');
    expect(task).toBeDefined();
    expect(task?.overdue).toBe(true);
    expect(task?.completed).toBe(true);
    expect(task?.overduePoints).toBe(0);
  });

  it('assigns correct overduePoints based on hours overdue', () => {
    // WED = 2026-05-27T10:00:00
    // Task A due Mon 2026-05-25: deadline = Tue 00:00, hours overdue ≈ 34h → 30 pts (≥24h bracket)
    // Task B due Tue 2026-05-26: deadline = Wed 00:00, hours overdue ≈ 10h → 10 pts (6-12h bracket)
    const store: WeeklyPlanStore = {
      ...EMPTY_STORE,
      templates: {
        ...EMPTY_STORE.templates,
        mon: ['Task A'],
        tue: ['Task B'],
      },
    };
    const tasks = deriveTasksForToday(store, WED);
    const taskA = tasks.find(t => t.title === 'Task A');
    const taskB = tasks.find(t => t.title === 'Task B');
    expect(taskA?.overduePoints).toBe(30); // ≥24h overdue
    expect(taskB?.overduePoints).toBe(10); // 6-12h overdue
  });

  it('marks incomplete prior-day one-offs as overdue', () => {
    const store: WeeklyPlanStore = {
      ...EMPTY_STORE,
      oneoffs: {
        ...EMPTY_STORE.oneoffs,
        tue: [{ id: 'oo-1', title: 'Buy card' }],
      },
    };
    const tasks = deriveTasksForToday(store, WED);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].overdue).toBe(true);
    expect(tasks[0].title).toBe('Buy card');
  });

  it('today tasks start as incomplete', () => {
    const store: WeeklyPlanStore = {
      ...EMPTY_STORE,
      templates: { ...EMPTY_STORE.templates, wed: ['Stand-up'] },
    };
    const tasks = deriveTasksForToday(store, WED);
    expect(tasks[0].completed).toBe(false);
  });

  it('today template task is completed when in completions', () => {
    const store: WeeklyPlanStore = {
      ...EMPTY_STORE,
      templates: { ...EMPTY_STORE.templates, wed: ['Stand-up'] },
      completions: { '2026-05-27': { templateTitles: ['Stand-up'], oneoffIds: [] } },
    };
    const tasks = deriveTasksForToday(store, WED);
    expect(tasks[0].completed).toBe(true);
  });
});

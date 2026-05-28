import {
  formatAdded,
  formatOverdueDuration,
  computeHabitLatePoints,
  formatTaskTime,
} from '../utils/format';

// Fixed "now" reference: 2026-05-27T10:00:00 (Wednesday 10am)
const NOW = new Date('2026-05-27T10:00:00').getTime();

describe('formatAdded', () => {
  it('returns "just now" when added less than 1 minute ago', () => {
    expect(formatAdded(NOW - 30_000, NOW)).toBe('just now');
  });

  it('returns "1m ago" at exactly 1 minute', () => {
    expect(formatAdded(NOW - 60_000, NOW)).toBe('1m ago');
  });

  it('returns "Xm ago" when added within the hour', () => {
    expect(formatAdded(NOW - 45 * 60_000, NOW)).toBe('45m ago');
  });

  it('returns "1h ago" at exactly 1 hour', () => {
    expect(formatAdded(NOW - 3_600_000, NOW)).toBe('1h ago');
  });

  it('returns "Xh ago" when added within the day', () => {
    expect(formatAdded(NOW - 7 * 3_600_000, NOW)).toBe('7h ago');
  });

  it('returns "1d ago" at exactly 24 hours', () => {
    expect(formatAdded(NOW - 24 * 3_600_000, NOW)).toBe('1d ago');
  });

  it('returns "Xd ago" for multiple days', () => {
    expect(formatAdded(NOW - 3 * 24 * 3_600_000, NOW)).toBe('3d ago');
  });
});

describe('computeHabitLatePoints', () => {
  // scheduled at 10:00 — all "now" values are on the same day
  const HHMM = '10:00';

  it('returns 0 within the 10-minute grace period', () => {
    expect(computeHabitLatePoints(HHMM, new Date('2026-05-28T10:05:00'))).toBe(0);
  });

  it('returns 0 at 9 minutes late (just inside grace)', () => {
    expect(computeHabitLatePoints(HHMM, new Date('2026-05-28T10:09:59'))).toBe(0);
  });

  it('returns 5 at exactly 10 minutes late', () => {
    expect(computeHabitLatePoints(HHMM, new Date('2026-05-28T10:10:00'))).toBe(5);
  });

  it('returns 5 at 30 minutes late', () => {
    expect(computeHabitLatePoints(HHMM, new Date('2026-05-28T10:30:00'))).toBe(5);
  });

  it('returns 5 at 59 minutes late', () => {
    expect(computeHabitLatePoints(HHMM, new Date('2026-05-28T10:59:00'))).toBe(5);
  });

  it('returns 10 at exactly 60 minutes late', () => {
    expect(computeHabitLatePoints(HHMM, new Date('2026-05-28T11:00:00'))).toBe(10);
  });

  it('returns 10 when several hours late', () => {
    expect(computeHabitLatePoints(HHMM, new Date('2026-05-28T15:00:00'))).toBe(10);
  });
});

describe('formatTaskTime', () => {
  it('returns the formatted scheduled time for a habit with scheduledTime', () => {
    expect(formatTaskTime('habit', undefined, '07:30')).toBe('7:30 AM');
  });

  it('returns 8:00 AM for a habit without scheduledTime', () => {
    expect(formatTaskTime('habit', undefined, undefined)).toBe('8:00 AM');
  });

  it('returns 8:00 AM for a template task', () => {
    expect(formatTaskTime('template', undefined, undefined)).toBe('8:00 AM');
  });

  it('extracts wall-clock time from createdAt for a one-off task', () => {
    const ts = new Date('2026-05-28T14:30:00').getTime();
    expect(formatTaskTime('one-off', ts, undefined)).toBe('2:30 PM');
  });

  it('returns 8:00 AM as fallback for one-off with no createdAt', () => {
    expect(formatTaskTime('one-off', undefined, undefined)).toBe('8:00 AM');
  });

  it('prefers scheduledTime over createdAt', () => {
    const ts = new Date('2026-05-28T14:30:00').getTime();
    // formatScheduledTime drops :00 minutes → '8 AM' not '8:00 AM'
    expect(formatTaskTime('habit', ts, '08:00')).toBe('8 AM');
  });
});

describe('formatOverdueDuration', () => {
  // dueDate = 2026-05-25 (Monday) → deadline = 2026-05-26T00:00:00
  const DUE_DATE = '2026-05-25';
  const DEADLINE = new Date('2026-05-26T00:00:00').getTime();

  it('returns "< 1h overdue" when just past deadline', () => {
    expect(formatOverdueDuration(DUE_DATE, DEADLINE + 30 * 60_000)).toBe('< 1h overdue');
  });

  it('returns "1h overdue" at exactly 1 hour past', () => {
    expect(formatOverdueDuration(DUE_DATE, DEADLINE + 3_600_000)).toBe('1h overdue');
  });

  it('returns "Xh overdue" within the first day', () => {
    expect(formatOverdueDuration(DUE_DATE, DEADLINE + 10 * 3_600_000)).toBe('10h overdue');
  });

  it('returns "1d overdue" at exactly 24 hours', () => {
    expect(formatOverdueDuration(DUE_DATE, DEADLINE + 24 * 3_600_000)).toBe('1d overdue');
  });

  it('returns "Xd Xh overdue" when past with remainder hours', () => {
    expect(formatOverdueDuration(DUE_DATE, DEADLINE + 25 * 3_600_000)).toBe('1d 1h overdue');
  });

  it('returns "Xd overdue" for exact day multiples', () => {
    expect(formatOverdueDuration(DUE_DATE, DEADLINE + 48 * 3_600_000)).toBe('2d overdue');
  });
});

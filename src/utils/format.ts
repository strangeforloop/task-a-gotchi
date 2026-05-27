/**
 * Human-readable relative time since a task was added.
 * @param createdAt  unix ms timestamp
 * @param now        unix ms timestamp (defaults to Date.now(); injectable for tests)
 */
export function formatAdded(createdAt: number, now: number = Date.now()): string {
  const mins = Math.floor((now - createdAt) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/**
 * How long ago a habit was started, relative to now.
 * @param isoDate  ISO date string (YYYY-MM-DD) when the habit was created
 * @param now      injectable Date for testing (defaults to new Date())
 */
export function formatHabitSince(isoDate: string, now: Date = new Date()): string {
  const start = new Date(isoDate + 'T00:00:00');
  const days = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  if (days <= 0) return 'started today';
  if (days === 1) return 'started yesterday';
  if (days < 30) return `started ${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `started ${weeks}w ago`;
}

/**
 * Converts 24h "HH:MM" to a readable AM/PM string.
 * "08:00" → "8:00 AM",  "14:30" → "2:30 PM"
 */
export function formatScheduledTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const mm = m === 0 ? '' : `:${String(m).padStart(2, '0')}`;
  return `${h12}${mm} ${period}`;
}

/**
 * Returns a "Xm late" / "Xh late" label if the current time is ≥10 min
 * past the scheduled time, otherwise undefined.
 * @param hhmm  "HH:MM" scheduled time
 * @param now   current Date
 */
export function computeHabitLateLabel(hhmm: string, now: Date): string | undefined {
  const [hStr, mStr] = hhmm.split(':');
  const scheduled = new Date(now);
  scheduled.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
  const lateMs = now.getTime() - scheduled.getTime();
  const lateMins = Math.floor(lateMs / 60_000);
  if (lateMins < 10) return undefined; // grace period
  if (lateMins < 60) return `${lateMins}m late`;
  return `${Math.floor(lateMins / 60)}h late`;
}

/**
 * HP penalty for a habit that is past its scheduled time but not yet
 * completed today. Mirrors the late-label tiers:
 *   < 10 min → 0 (grace period)
 *   10–59 min → −3 HP  (matches "Xm late" label)
 *   60 min+   → −5 HP  (matches "Xh late" label)
 */
export function computeHabitLatePoints(hhmm: string, now: Date): number {
  const [hStr, mStr] = hhmm.split(':');
  const scheduled = new Date(now);
  scheduled.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
  const lateMins = Math.floor((now.getTime() - scheduled.getTime()) / 60_000);
  if (lateMins < 10) return 0;
  if (lateMins < 60) return 3;
  return 5;
}

/**
 * Human-readable duration since an overdue task's deadline.
 * Deadline = midnight at the START of the day after dueDate.
 * @param dueDate  ISO date string (YYYY-MM-DD) of the day the task was assigned
 * @param now      unix ms timestamp (defaults to Date.now(); injectable for tests)
 */
export function formatOverdueDuration(dueDate: string, now: number = Date.now()): string {
  const deadline = new Date(dueDate + 'T00:00:00');
  deadline.setDate(deadline.getDate() + 1);
  const hours = Math.floor((now - deadline.getTime()) / 3_600_000);
  if (hours < 1) return '< 1h overdue';
  if (hours < 24) return `${hours}h overdue`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return rem > 0 ? `${days}d ${rem}h overdue` : `${days}d overdue`;
}

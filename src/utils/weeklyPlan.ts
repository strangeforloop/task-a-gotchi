import type { Day, DayId, Task, WeeklyPlanStore, WeeklyTaskEntry } from '../types';

const DAY_IDS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_SHORTS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LONGS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function getIsoDate(date: Date): string {
  // Use the LOCAL calendar date, not toISOString() (which converts to UTC).
  // The rest of the app derives the day-of-week and week start from local time
  // (getDay/getDate), so a UTC key would disagree with them in the evening for
  // timezones behind UTC — flipping the key a day and triggering a spurious
  // week-rollover reset that wipes tasks. Local formatting keeps every date key
  // consistent with todayId/weekStart.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getWeekStart(now: Date = new Date()): string {
  const day = now.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return getIsoDate(monday);
}

export function getTodayDayId(now: Date = new Date()): DayId {
  const day = now.getDay(); // 0=Sun … 6=Sat
  const index = day === 0 ? 6 : day - 1; // shift so Mon=0 … Sun=6
  return DAY_IDS[index];
}

export function computeWeekDays(weekStart: string, now: Date = new Date()): Day[] {
  const monday = new Date(weekStart + 'T00:00:00');
  const todayIso = getIsoDate(now);
  return DAY_IDS.map((id, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      id,
      short: DAY_SHORTS[i],
      long: DAY_LONGS[i],
      num: d.getDate(),
      today: getIsoDate(d) === todayIso,
    };
  });
}

export function dayIsoFromWeekStart(weekStart: string, dayIndex: number): string {
  const monday = new Date(weekStart + 'T00:00:00');
  monday.setDate(monday.getDate() + dayIndex);
  return getIsoDate(monday);
}

/** Hours a task has been overdue (deadline = midnight at end of its due day). */
function hoursOverdue(dueDate: string, now: Date): number {
  // Deadline = start of the day AFTER the due date (midnight)
  const deadline = new Date(dueDate + 'T00:00:00');
  deadline.setDate(deadline.getDate() + 1);
  return Math.max(0, (now.getTime() - deadline.getTime()) / 3_600_000);
}

/** HP penalty for a given number of hours overdue. 6h grace period before anything hits. */
function pointsForHours(hours: number): number {
  if (hours < 6) return 0;
  if (hours < 12) return 10;
  if (hours < 24) return 20;
  return 30;
}

export function deriveTasksForToday(store: WeeklyPlanStore, now: Date = new Date()): Task[] {
  const todayId = getTodayDayId(now);
  const todayIndex = DAY_IDS.indexOf(todayId);
  const todayIso = getIsoDate(now);
  const todayCompletions = store.completions[todayIso] ?? { templateTitles: [], oneoffIds: [] };

  const tasks: Task[] = [];

  // Overdue tasks from previous days this week
  for (let i = 0; i < todayIndex; i++) {
    const dayId = DAY_IDS[i];
    const dayIso = dayIsoFromWeekStart(store.weekStart, i);
    const dayCompletions = store.completions[dayIso] ?? { templateTitles: [], oneoffIds: [] };
    const hours = hoursOverdue(dayIso, now);
    const overduePoints = pointsForHours(hours);

    for (const title of store.templates[dayId] ?? []) {
      const isCompleted = dayCompletions.templateTitles.includes(title);
      tasks.push({
        id: `overdue-tmpl-${dayId}-${title}`,
        title,
        overdue: true,
        overdueFrom: DAY_LONGS[i],
        dueDate: dayIso,
        overduePoints: isCompleted ? 0 : overduePoints,
        source: 'template',
        completed: isCompleted,
      });
    }

    for (const entry of store.oneoffs[dayId] ?? []) {
      const isCompleted = dayCompletions.oneoffIds.includes(entry.id);
      tasks.push({
        id: `overdue-oneoff-${entry.id}`,
        title: entry.title,
        overdue: true,
        overdueFrom: DAY_LONGS[i],
        dueDate: dayIso,
        overduePoints: isCompleted ? 0 : overduePoints,
        source: 'one-off',
        completed: isCompleted,
      });
    }
  }

  // Today's template tasks
  for (const title of store.templates[todayId] ?? []) {
    tasks.push({
      id: `today-tmpl-${title}`,
      title,
      overdue: false,
      source: 'template',
      completed: todayCompletions.templateTitles.includes(title),
    });
  }

  // Today's one-off tasks
  for (const entry of store.oneoffs[todayId] ?? []) {
    tasks.push({
      id: `today-oneoff-${entry.id}`,
      title: entry.title,
      overdue: false,
      source: 'one-off',
      completed: todayCompletions.oneoffIds.includes(entry.id),
      createdAt: entry.createdAt,
    });
  }

  return tasks;
}

export function seedOneoffs(oneoffs: Record<string, string[]>): Record<DayId, WeeklyTaskEntry[]> {
  const result: Record<DayId, WeeklyTaskEntry[]> = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  };
  for (const [dayId, titles] of Object.entries(oneoffs)) {
    result[dayId as DayId] = titles.map((title, i) => ({
      id: `seed-${dayId}-${i}`,
      title,
    }));
  }
  return result;
}

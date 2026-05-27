import type { DayCompletions } from '../types';

/**
 * Count the number of consecutive days (backwards from `today`) that have
 * at least one completed task (template or one-off).
 *
 * `today` is an ISO date string ('YYYY-MM-DD').
 *
 * Note: WeeklyPlanContext resets `completions` to {} on week rollover, so the
 * streak will naturally reset at the start of each new week. Persisting a
 * highestStreak in ProfileStore is a future enhancement.
 */
export function computeStreak(completions: Record<string, DayCompletions>, today: string): number {
  let streak = 0;
  const cursor = new Date(today + 'T00:00:00');

  for (let i = 0; i < 3650; i++) {
    const iso = cursor.toISOString().slice(0, 10);
    const day = completions[iso];
    const hasAny = day !== undefined && (day.templateTitles.length > 0 || day.oneoffIds.length > 0);
    if (!hasAny) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

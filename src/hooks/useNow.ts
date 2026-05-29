import { useEffect, useState } from 'react';

/**
 * Returns the current time (unix ms) as React state, refreshed on an interval.
 * Lets render stay pure (no `Date.now()` call during render) while still letting
 * time-derived values — like how long the pet has been at 0 HP — advance.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

import { useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';

/**
 * Keeps `ProfileContext.hpZeroSince` in sync with the current HP:
 * stamps the moment HP first hits 0, and clears it once HP recovers.
 * `deadHours` (in usePetHp) is derived from that timestamp, so the pet can
 * actually reach the 'dead' state after 48h at 0 HP.
 *
 * Call this once, from the always-mounted home screen, so the timestamp has a
 * single writer.
 */
export function useDeadStateTracker(hp: number): void {
  const { hpZeroSince, setHpZeroSince } = useProfile();

  useEffect(() => {
    if (hp <= 0 && hpZeroSince == null) {
      setHpZeroSince(Date.now());
    } else if (hp > 0 && hpZeroSince != null) {
      setHpZeroSince(null);
    }
  }, [hp, hpZeroSince, setHpZeroSince]);
}

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
export function useDeadStateTracker(hp: number, deadHours: number): void {
  const { hpZeroSince, setHpZeroSince } = useProfile();

  useEffect(() => {
    if (hp <= 0 && hpZeroSince == null) {
      setHpZeroSince(Date.now());
    } else if (hp > 0 && hpZeroSince != null && deadHours < 48) {
      // Auto-recover only within the 48h grace window. Once the pet is a ghost
      // (>= 48h), the latch holds — only recordRevive (3 tasks) brings it back,
      // otherwise the first task that nudges HP above 0 would auto-revive it.
      setHpZeroSince(null);
    }
  }, [hp, hpZeroSince, setHpZeroSince, deadHours]);
}

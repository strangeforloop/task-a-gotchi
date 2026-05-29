import { useProfile } from '../context/ProfileContext';
import { decayMood, moodTier, moodLabel, type MoodTier } from '../utils/mood';
import { useNow } from './useNow';

interface PetMood {
  /** Current mood 0–100, decayed to "now". */
  mood: number;
  tier: MoodTier;
  label: string;
}

/**
 * Live, time-decayed mood for display. Reads the persisted mood from
 * ProfileContext and decays it against a ticking clock so it drifts down
 * on its own between interactions.
 */
export function usePetMood(): PetMood {
  const { mood, moodUpdatedAt } = useProfile();
  const now = useNow(60_000);
  const current = decayMood(mood, moodUpdatedAt, now);
  return { mood: Math.round(current), tier: moodTier(current), label: moodLabel(current) };
}

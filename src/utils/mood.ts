// Mood / affinity: the "fun" layer. Interactions raise it, time gently decays
// it. It is deliberately NOT part of survival — HP (driven by real tasks/habits)
// is what keeps the pet alive. Mood only colors how the pet expresses itself.

export const MOOD_MAX = 100;
export const MOOD_MIN = 0;
export const MOOD_START = 60;

/** Mood lost per hour with no interaction. ~30h from full to empty — gentle, never lethal. */
const DECAY_PER_HOUR = 2;

export type InteractionKind = 'pet' | 'feed' | 'play' | 'talk';

const INTERACTION_BOOST: Record<InteractionKind, number> = {
  pet: 15,
  feed: 20,
  play: 25,
  talk: 5,
};

const clamp = (n: number): number => Math.max(MOOD_MIN, Math.min(MOOD_MAX, n));

/** Current mood after time-decay since it was last updated. */
export function decayMood(mood: number, lastUpdated: number, now: number): number {
  const hours = Math.max(0, (now - lastUpdated) / 3_600_000);
  return clamp(mood - hours * DECAY_PER_HOUR);
}

/** Apply an interaction's boost on top of the (already decayed) current mood. */
export function applyInteraction(mood: number, kind: InteractionKind): number {
  return clamp(mood + INTERACTION_BOOST[kind]);
}

export type MoodTier = 'loved' | 'content' | 'lonely' | 'neglected';

export function moodTier(mood: number): MoodTier {
  if (mood >= 80) return 'loved';
  if (mood >= 50) return 'content';
  if (mood >= 25) return 'lonely';
  return 'neglected';
}

const TIER_LABEL: Record<MoodTier, string> = {
  loved: 'Loved',
  content: 'Content',
  lonely: 'Lonely',
  neglected: 'Neglected',
};

export function moodLabel(mood: number): string {
  return TIER_LABEL[moodTier(mood)];
}

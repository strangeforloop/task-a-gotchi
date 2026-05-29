import {
  applyInteraction,
  decayMood,
  moodLabel,
  moodTier,
  MOOD_MAX,
  MOOD_MIN,
  MOOD_START,
} from '../utils/mood';

const HOUR = 3_600_000;

describe('decayMood', () => {
  it('returns the same mood when no time has passed', () => {
    expect(decayMood(60, 1000, 1000)).toBe(60);
  });

  it('decays 2 points per hour', () => {
    expect(decayMood(60, 0, 10 * HOUR)).toBe(40);
  });

  it('never drops below MOOD_MIN', () => {
    expect(decayMood(10, 0, 100 * HOUR)).toBe(MOOD_MIN);
  });

  it('treats a future-ish lastUpdated as no decay (no negative time)', () => {
    expect(decayMood(50, 5000, 1000)).toBe(50);
  });
});

describe('applyInteraction', () => {
  it('adds the boost for each kind', () => {
    expect(applyInteraction(10, 'talk')).toBe(15);
    expect(applyInteraction(10, 'pet')).toBe(25);
    expect(applyInteraction(10, 'feed')).toBe(30);
    expect(applyInteraction(10, 'play')).toBe(35);
  });

  it('caps at MOOD_MAX', () => {
    expect(applyInteraction(95, 'play')).toBe(MOOD_MAX);
  });
});

describe('moodTier / moodLabel', () => {
  it('maps ranges to tiers', () => {
    expect(moodTier(90)).toBe('loved');
    expect(moodTier(60)).toBe('content');
    expect(moodTier(30)).toBe('lonely');
    expect(moodTier(5)).toBe('neglected');
  });

  it('uses inclusive lower bounds', () => {
    expect(moodTier(80)).toBe('loved');
    expect(moodTier(50)).toBe('content');
    expect(moodTier(25)).toBe('lonely');
  });

  it('labels the starting mood as Content', () => {
    expect(moodLabel(MOOD_START)).toBe('Content');
  });
});

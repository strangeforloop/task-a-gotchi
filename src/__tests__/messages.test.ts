import { pickMessage } from '../utils/messages';
import { MOTIVATIONAL_MESSAGES } from '../constants/messages';

describe('pickMessage', () => {
  it('returns a string', () => {
    expect(typeof pickMessage()).toBe('string');
  });

  it('returns a value from MOTIVATIONAL_MESSAGES', () => {
    const msg = pickMessage();
    expect(MOTIVATIONAL_MESSAGES).toContain(msg);
  });

  it('does not always return the same message', () => {
    const results = new Set(Array.from({ length: 30 }, () => pickMessage()));
    expect(results.size).toBeGreaterThan(1);
  });
});

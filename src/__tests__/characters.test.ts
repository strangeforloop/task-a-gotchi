import { CHARACTERS, framesFor, GHOST_FRAMES } from '../constants/characters';
import type { CharacterId } from '../types';

describe('framesFor', () => {
  const ids: CharacterId[] = ['blip', 'buni', 'nova'];

  it('returns the shared ghost frames for the dead state on every character', () => {
    for (const id of ids) {
      expect(framesFor(CHARACTERS[id], 'dead', 'dead')).toBe(GHOST_FRAMES);
    }
  });

  it('returns the character template for non-dead states', () => {
    for (const id of ids) {
      expect(framesFor(CHARACTERS[id], 'happy', 'normal')).toBe(CHARACTERS[id].normal);
    }
  });

  it('ghost frames all have uniform row width', () => {
    for (const frame of GHOST_FRAMES) {
      const w = frame[0].length;
      for (const row of frame) {
        expect(row.length).toBe(w);
      }
    }
  });
});

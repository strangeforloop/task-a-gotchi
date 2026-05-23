import { BUTTON_DEFINITIONS } from '../constants/colors';

describe('BUTTON_DEFINITIONS', () => {
  it('has three buttons', () => {
    expect(BUTTON_DEFINITIONS).toHaveLength(3);
  });

  it('sub labels are pet, feed, talk in order', () => {
    expect(BUTTON_DEFINITIONS.map(b => b.sub)).toEqual(['pet', 'feed', 'talk']);
  });

  it('button ids are a, b, c in order', () => {
    expect(BUTTON_DEFINITIONS.map(b => b.id)).toEqual(['a', 'b', 'c']);
  });
});

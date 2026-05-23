import { renderHook, act } from '@testing-library/react-native';
import { useEffectTimer } from '../hooks/useEffectTimer';

describe('useEffectTimer', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('starts with effect null', () => {
    const { result } = renderHook(() => useEffectTimer());
    expect(result.current.effect).toBeNull();
  });

  it('sets effect when playEffect is called (pet)', () => {
    const { result } = renderHook(() => useEffectTimer());
    act(() => result.current.playEffect('purr'));
    expect(result.current.effect).toBe('purr');
  });

  it('sets effect when playEffect is called (feed)', () => {
    const { result } = renderHook(() => useEffectTimer());
    act(() => result.current.playEffect('feed'));
    expect(result.current.effect).toBe('feed');
  });

  it('clears effect after the given duration', () => {
    const { result } = renderHook(() => useEffectTimer());
    act(() => result.current.playEffect('purr', 1000));
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.effect).toBeNull();
  });

  it('does not clear before duration has elapsed', () => {
    const { result } = renderHook(() => useEffectTimer());
    act(() => result.current.playEffect('feed', 1700));
    act(() => jest.advanceTimersByTime(1699));
    expect(result.current.effect).toBe('feed');
  });

  it('replaces an active effect with a new one', () => {
    const { result } = renderHook(() => useEffectTimer());
    act(() => result.current.playEffect('purr', 2000));
    act(() => result.current.playEffect('feed', 2000));
    expect(result.current.effect).toBe('feed');
  });
});

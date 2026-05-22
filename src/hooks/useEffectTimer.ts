import { useState, useCallback, useRef } from 'react';
import type { EffectKind } from '../types';

interface UseEffectTimerResult {
  effect: EffectKind | null;
  playEffect: (kind: EffectKind, duration?: number) => void;
}

export function useEffectTimer(): UseEffectTimerResult {
  const [effect, setEffect] = useState<EffectKind | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playEffect = useCallback((kind: EffectKind, duration = 1500) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setEffect(kind);
    timerRef.current = setTimeout(() => setEffect(null), duration);
  }, []);

  return { effect, playEffect };
}

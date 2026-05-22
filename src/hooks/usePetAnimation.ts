import { useState, useEffect, useRef } from 'react';
import type { PetState, CharacterId } from '../types';
import { STATE_TO_TEMPLATE } from '../constants/characters';

interface PetAnimationResult {
  frame: number;
  displayState: PetState;
  opacity: number;
}

export function usePetAnimation(
  _character: CharacterId,
  state: PetState,
  animate = true,
): PetAnimationResult {
  const [frame, setFrame] = useState(0);
  const [displayState, setDisplayState] = useState<PetState>(state);
  const [opacity, setOpacity] = useState(1);
  const crossfadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state === displayState) return;
    setOpacity(0);
    crossfadeRef.current = setTimeout(() => {
      setDisplayState(state);
      setOpacity(1);
    }, 240);
    return () => {
      if (crossfadeRef.current) clearTimeout(crossfadeRef.current);
    };
  }, [state, displayState]);

  useEffect(() => {
    if (!animate) return;
    const { interval } = STATE_TO_TEMPLATE[displayState] ?? STATE_TO_TEMPLATE.happy;
    const id = setInterval(() => setFrame(f => 1 - f), interval);
    return () => clearInterval(id);
  }, [animate, displayState]);

  return { frame, displayState, opacity };
}

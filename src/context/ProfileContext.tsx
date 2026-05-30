import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CharacterId, ColorwayId, ProfileStore } from '../types';
import { writeStore } from '../utils/storage';
import { applyInteraction, decayMood, MOOD_START, type InteractionKind } from '../utils/mood';
import { advanceRevive } from '../utils/revive';

const PROFILE_KEY = 'task-a-gotchi:profile-v1';

const DEFAULT: ProfileStore = {
  character: 'blip',
  colorway: 'butter',
  hpZeroSince: null,
  onboarded: false,
  mood: MOOD_START,
  moodUpdatedAt: Date.now(),
  reviveProgress: 0,
};

interface ProfileContextValue {
  character: CharacterId;
  colorway: ColorwayId;
  hpZeroSince: number | null;
  onboarded: boolean;
  mood: number;
  moodUpdatedAt: number;
  /** False until the persisted profile has loaded — gate first-run routing on this. */
  hydrated: boolean;
  setCharacter: (id: CharacterId) => void;
  setColorway: (id: ColorwayId) => void;
  setHpZeroSince: (value: number | null) => void;
  setOnboarded: (value: boolean) => void;
  /** Record a pet interaction: decays mood to now, then applies the boost. */
  recordInteraction: (kind: InteractionKind) => void;
  /** Tasks completed toward reviving the ghost (0..REVIVE_GOAL). */
  reviveProgress: number;
  /** Count a completed task toward revival; returns whether it resurrected the pet. */
  recordRevive: () => boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileStore>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  // Stable fallback timestamp (computed once) for the rare case a persisted
  // profile predates the mood fields — avoids calling Date.now() during render.
  const [mountedAt] = useState(() => Date.now());

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY)
      .then(raw => {
        if (!raw) return;
        try {
          setProfile({ ...DEFAULT, ...JSON.parse(raw) });
        } catch {
          // corrupt data — keep defaults
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  // Functional update so rapid successive writes (e.g. character then colorway)
  // can't clobber each other via a stale closure. Persist the freshly merged store.
  const update = useCallback((patch: Partial<ProfileStore>) => {
    setProfile(prev => {
      const next = { ...prev, ...patch };
      writeStore(PROFILE_KEY, next);
      return next;
    });
  }, []);

  const setCharacter = useCallback((id: CharacterId) => update({ character: id }), [update]);
  const setColorway = useCallback((id: ColorwayId) => update({ colorway: id }), [update]);
  const setHpZeroSince = useCallback(
    (value: number | null) => update({ hpZeroSince: value }),
    [update],
  );
  const setOnboarded = useCallback((value: boolean) => update({ onboarded: value }), [update]);

  const recordInteraction = useCallback((kind: InteractionKind) => {
    setProfile(prev => {
      const now = Date.now();
      const current = decayMood(prev.mood ?? MOOD_START, prev.moodUpdatedAt ?? now, now);
      const next = { ...prev, mood: applyInteraction(current, kind), moodUpdatedAt: now };
      writeStore(PROFILE_KEY, next);
      return next;
    });
  }, []);

  // Advance the ghost revive counter. Returns whether this completion resurrected
  // the pet; on resurrect we also clear hpZeroSince so the dead latch releases and
  // HP recomputes from the just-completed tasks.
  const recordRevive = useCallback((): boolean => {
    const res = advanceRevive(profile.reviveProgress ?? 0);
    update({
      reviveProgress: res.reviveProgress,
      ...(res.resurrected ? { hpZeroSince: null } : {}),
    });
    return res.resurrected;
  }, [profile, update]);

  return (
    <ProfileContext.Provider
      value={{
        character: profile.character,
        colorway: profile.colorway,
        hpZeroSince: profile.hpZeroSince ?? null,
        onboarded: profile.onboarded ?? false,
        mood: profile.mood ?? MOOD_START,
        moodUpdatedAt: profile.moodUpdatedAt ?? mountedAt,
        hydrated,
        setCharacter,
        setColorway,
        setHpZeroSince,
        setOnboarded,
        recordInteraction,
        reviveProgress: profile.reviveProgress ?? 0,
        recordRevive,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}

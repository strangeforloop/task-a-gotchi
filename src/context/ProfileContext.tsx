import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CharacterId, ColorwayId, ProfileStore } from '../types';

const PROFILE_KEY = 'task-a-gotchi:profile-v1';

const DEFAULT: ProfileStore = {
  character: 'blip',
  colorway: 'butter',
};

interface ProfileContextValue {
  character: CharacterId;
  colorway: ColorwayId;
  setCharacter: (id: CharacterId) => void;
  setColorway: (id: ColorwayId) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileStore>(DEFAULT);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then(raw => {
      if (!raw) return;
      try {
        setProfile({ ...DEFAULT, ...JSON.parse(raw) });
      } catch {
        // corrupt data — keep defaults
      }
    });
  }, []);

  const persist = useCallback((next: ProfileStore) => {
    setProfile(next);
    AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const setCharacter = useCallback(
    (id: CharacterId) => persist({ ...profile, character: id }),
    [persist, profile],
  );

  const setColorway = useCallback(
    (id: ColorwayId) => persist({ ...profile, colorway: id }),
    [persist, profile],
  );

  return (
    <ProfileContext.Provider value={{ ...profile, setCharacter, setColorway }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}

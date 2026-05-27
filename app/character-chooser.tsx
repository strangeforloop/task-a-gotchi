import React from 'react';
import { useRouter } from 'expo-router';
import { CharacterChooser } from '../src/components/pet/CharacterChooser';
import { useProfile } from '../src/context/ProfileContext';

export default function CharacterChooserScreen() {
  const router = useRouter();
  const { character, setCharacter } = useProfile();
  return (
    <CharacterChooser
      onClose={() => router.back()}
      current={character}
      onPick={id => {
        setCharacter(id);
        router.back();
      }}
    />
  );
}

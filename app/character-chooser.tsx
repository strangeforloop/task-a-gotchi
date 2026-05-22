import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { CharacterChooser } from '../src/components/pet/CharacterChooser';
import type { CharacterId } from '../src/types';

export default function CharacterChooserScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState<CharacterId>('blip');
  return (
    <CharacterChooser
      open
      onClose={() => router.back()}
      current={current}
      onPick={(id) => { setCurrent(id); router.back(); }}
    />
  );
}

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { CharacterId } from '../../types';
import { CHARACTERS } from '../../constants/characters';
import { PetSprite } from './PetSprite';

interface Props {
  onClose: () => void;
  current: CharacterId;
  onPick: (id: CharacterId) => void;
}

const CHARACTER_IDS: CharacterId[] = ['blip', 'buni', 'nova'];

export function CharacterChooser({ onClose, current, onPick }: Props) {
  return (
    <Pressable style={styles.backdrop} onPress={onClose}>
      {/* Inner Pressable stops tap-through so the card itself doesn't close */}
      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.title}>Pick your pet</Text>

        <View style={styles.row}>
          {CHARACTER_IDS.map(id => {
            const def = CHARACTERS[id];
            const active = id === current;
            return (
              <Pressable
                key={id}
                onPress={() => onPick(id)}
                style={[styles.option, active && styles.optionActive]}
              >
                <View style={styles.spriteBox}>
                  <PetSprite
                    character={id}
                    state="thriving"
                    cell={4}
                    animate={false}
                    monochrome
                    inkColor="#1F2410"
                  />
                </View>
                <Text style={[styles.name, active && styles.nameActive]}>{def.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20,15,5,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    backgroundColor: '#FAF7F0',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(60,60,67,0.04)',
  },
  optionActive: {
    backgroundColor: '#FFF6E0',
  },
  spriteBox: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: '#B0BD78',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(60,60,67,0.6)',
    letterSpacing: 0.1,
  },
  nameActive: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
});

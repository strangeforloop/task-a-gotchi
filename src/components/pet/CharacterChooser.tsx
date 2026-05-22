import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import type { CharacterId } from '../../types';
import { CHARACTERS } from '../../constants/characters';
import { PetSprite } from './PetSprite';

interface Props {
  open: boolean;
  onClose: () => void;
  current: CharacterId;
  onPick: (id: CharacterId) => void;
}

const CHARACTER_IDS: CharacterId[] = ['blip', 'buni', 'nova'];

export function CharacterChooser({ open, onClose, current, onPick }: Props) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.eyebrow}>◆ HP MAX · EVOLUTION UNLOCKED ◆</Text>
          <Text style={styles.title}>Pick your pet</Text>
          {CHARACTER_IDS.map(id => {
            const def = CHARACTERS[id];
            const active = id === current;
            return (
              <Pressable
                key={id}
                onPress={() => { onPick(id); onClose(); }}
                style={[styles.card, active && styles.cardActive]}
              >
                <View style={styles.spriteBox}>
                  <PetSprite character={id} state="thriving" cell={3} monochrome inkColor="#1F2410" />
                </View>
                <View style={styles.info}>
                  <Text style={styles.charName}>{def.label}</Text>
                  <Text style={styles.blurb}>{def.blurb}</Text>
                </View>
                {active && <Text style={styles.current}>✓ Current</Text>}
              </Pressable>
            );
          })}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(20,15,5,0.55)', justifyContent: 'center', padding: 16 },
  sheet: { backgroundColor: '#FAF7F0', borderRadius: 22, padding: 20, gap: 8 },
  eyebrow: { fontSize: 10, fontWeight: '800', color: '#46A65A', letterSpacing: 1.6, fontFamily: 'monospace' },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(60,60,67,0.1)' },
  cardActive: { backgroundColor: '#FFF6E0', borderColor: '#46A65A', borderWidth: 1.5 },
  spriteBox: { width: 64, height: 64, backgroundColor: '#B0BD78', borderRadius: 6, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  info: { flex: 1 },
  charName: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  blurb: { fontSize: 13, color: 'rgba(60,60,67,0.65)', marginTop: 1 },
  current: { fontSize: 11, fontWeight: '800', color: '#46A65A' },
  closeBtn: { marginTop: 6, padding: 10, borderRadius: 12, backgroundColor: '#1a1a1a', alignItems: 'center' },
  closeTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

import React, { useRef, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useTasks } from '../src/hooks/useTasks';
import { useHealth } from '../src/hooks/useHealth';
import { usePetState } from '../src/hooks/usePetState';
import { useEffectTimer } from '../src/hooks/useEffectTimer';

import { HPHeader } from '../src/components/pet/HPHeader';
import { DeviceShell } from '../src/components/device/DeviceShell';
import { DeviceHeader } from '../src/components/device/DeviceHeader';
import { LCDScreen } from '../src/components/device/LCDScreen';
import { LCDTopRow } from '../src/components/device/LCDTopRow';
import { LCDActionRow } from '../src/components/device/LCDActionRow';
import { LCDStatBars } from '../src/components/device/LCDStatBars';
import { DeviceButtons } from '../src/components/device/DeviceButtons';
import { PetPlatform } from '../src/components/device/PetPlatform';
import { PetSprite } from '../src/components/pet/PetSprite';
import { HeartsBurst } from '../src/components/effects/HeartsBurst';
import { FoodBowl } from '../src/components/effects/FoodBowl';
import { MessageToast } from '../src/components/effects/MessageToast';
import { TaskList } from '../src/components/tasks/TaskList';
import { AddBar } from '../src/components/shared/AddBar';

import { DEVICE_PALETTES } from '../src/constants/colors';
import { pickMessage } from '../src/utils/messages';
import type { MenuId, CharacterId, ColorwayId } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, toggleTask, addTask } = useTasks();
  const hp = useHealth(tasks);
  const { state, meta } = usePetState(hp);
  const { effect, playEffect } = useEffectTimer();

  const [keyboard, setKeyboard] = useState(false);
  const [menu, setMenu] = useState<MenuId>('check');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [character, setCharacter] = useState<CharacterId>('blip');
  const [colorway] = useState<ColorwayId>('butter');
  const [streak] = useState(12);

  const todayTasks = tasks.filter(t => !t.overdue);
  const energy = todayTasks.length === 0 ? 0 : Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100);
  const focus = Math.min(100, Math.round((streak / 21) * 100));
  const overdueCount = tasks.filter(t => t.overdue && !t.completed).length;

  const onA = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playEffect('purr', 1500);
  };
  const onB = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playEffect('feed', 1700);
  };
  const onC = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setToast({ visible: true, message: pickMessage() });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 5500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <HPHeader
          hp={hp}
          deadHours={0}
          characterName={character}
          state={meta.label}
          streak={streak}
          canChoose={hp >= 100}
          onOpenChooser={() => router.push('/character-chooser')}
        />

        <View style={styles.deviceArea}>
          <DeviceShell palette={DEVICE_PALETTES[colorway]}>
            <DeviceHeader title="TASK-O-GOTCHI" level={streak} subtitle="POCKET PAL" />
            <LCDScreen>
              <LCDTopRow overdueCount={overdueCount} />
              <View style={styles.petStage}>
                <PetSprite character={character} state={state} cell={6} monochrome />
                <PetPlatform state={state} />
              </View>
              <HeartsBurst visible={effect === 'purr'} />
              <FoodBowl visible={effect === 'feed'} />
              <LCDActionRow selected={menu} onSelect={setMenu} />
              <LCDStatBars hp={hp} en={energy} fc={focus} />
            </LCDScreen>
            <DeviceButtons onA={onA} onB={onB} onC={onC} />
          </DeviceShell>
        </View>

        <View style={styles.speechSlot}>
          <MessageToast message={toast.message} visible={toast.visible} />
        </View>

        <ScrollView
          style={styles.taskScroll}
          contentContainerStyle={styles.taskContent}
          keyboardShouldPersistTaps="handled"
        >
          <TaskList tasks={tasks} onToggle={toggleTask} />
        </ScrollView>

        <Pressable
          onPress={() => router.push('/weekly')}
          style={styles.calBtn}
        >
        </Pressable>

        <AddBar onAdd={addTask} keyboard={keyboard} setKeyboard={setKeyboard} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF7F0' },
  screen: { flex: 1, backgroundColor: '#FAF7F0' },
  deviceArea: { alignItems: 'center', paddingVertical: 8 },
  petStage: { alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' },
  speechSlot: { height: 52, justifyContent: 'center' },
  taskScroll: { flex: 1 },
  taskContent: { paddingTop: 4 },
  calBtn: { position: 'absolute', top: 56, right: 18, width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)' },
});

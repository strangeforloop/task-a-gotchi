# Plan: React Native (Expo) Skeleton for Task-a-gotchi

## Context

The HTML/CSS/JS design prototype is already in `/Users/fr-qlab01/Projects/task-a-gotchi/` and serves as the pixel-perfect reference. The goal is to scaffold a production-quality Expo (expo-router + TypeScript) project in the same directory — typed components, navigation wiring, constants and hooks extracted — but **no real logic yet**. Every component returns a placeholder `<View>` with a label; hooks return stub values; screens are wired together.

---

## Step 0 — Commit design prototype to GitHub

Before any changes, commit the existing HTML prototype files (the Claude Design handoff) as the baseline:

```bash
git init
git add Task-a-gotchi.html app.jsx device.jsx effects.jsx \
        ios-frame.jsx pet-sprite.jsx task-list.jsx tweaks-panel.jsx weekly-modal.jsx
git commit -m "Add Claude Design prototype (Task-a-gotchi HTML reference)"
git remote add origin <user's GitHub remote>
git push -u origin main
```

This creates a clean checkpoint before the Expo scaffold lands on top.

---

## Step 1 — Initialize Expo project

Run in `/Users/fr-qlab01/Projects/task-a-gotchi/`:

```bash
npx create-expo-app@latest . --template blank-typescript
```

Then install all required dependencies:

```bash
npx expo install expo-router expo-haptics expo-notifications \
  @react-native-async-storage/async-storage react-native-reanimated
```

Configure `expo-router` in **app.json** (add plugin + scheme + update `main`):
- `"main": "expo-router/entry"`
- `"scheme": "taskagotchi"`
- `"plugins": ["expo-router"]`

Add `"expo-router"` to `babel.config.js` plugins if needed.

---

## Step 2 — File structure

```
app/
  _layout.tsx                  ← root Stack (headerShown: false for all)
  index.tsx                    ← main screen: HPHeader + Device + TaskList
  weekly.tsx                   ← weekly plan modal screen
  character-chooser.tsx        ← character chooser modal screen

src/
  types/
    index.ts                   ← all shared types/interfaces/enums

  constants/
    colors.ts                  ← DEVICE_PALETTES, LCD constants, BUTTON_DEFINITIONS
    characters.ts              ← CHARACTERS sprite data, STATE_TO_TEMPLATE
    data.ts                    ← INITIAL_TASKS, DAYS, TEMPLATE, ONEOFFS, TWEAK_DEFAULTS, STATE_META
    messages.ts                ← MOTIVATIONAL_MESSAGES

  hooks/
    useHealth.ts               ← computeHealth(), returns number 0–100
    usePetState.ts             ← maps health → PetState + StateMeta + barColor
    useTasks.ts                ← task state, toggleTask, addTask
    usePetAnimation.ts         ← frame counter + cross-fade on state change
    useEffectTimer.ts          ← plays an effect kind and auto-clears after duration

  utils/
    health.ts                  ← computeHealth, stateForHealth, healthColor (pure fns)
    messages.ts                ← pickMessage()

  components/
    device/
      DeviceShell.tsx          ← egg-shaped shell with palette + children
      DeviceHeader.tsx         ← pixel text "◆ TASK-O-GOTCHI ◆" + level
      LCDScreen.tsx            ← brass bezel + olive LCD panel + scanlines
      LCDTopRow.tsx            ← 4 pixel glyphs at top of LCD (heart/bolt/bowl/flag)
      LCDActionRow.tsx         ← check/pie/dot menu strip + selection indicator
      LCDStatBars.tsx          ← HP / EN / FC segment bars at LCD bottom
      DeviceButtons.tsx        ← A/B/C pastel buttons with press feedback
      PetPlatform.tsx          ← drop shadow ellipse under pet
      RevivalChip.tsx          ← "Revive N/3" chip shown when dead
      PixelGlyph.tsx           ← renders a named glyph from dot-grid string arrays

    pet/
      PetSprite.tsx            ← pixel pet character, 2-frame animation, monochrome mode
      HPHeader.tsx             ← 24-segment HP bar + character name + state + chooser btn
      CharacterChooser.tsx     ← modal: pick Blip / Buni / Nova (unlocks at HP 100)

    tasks/
      TaskList.tsx             ← overdue section + today section, scrollable
      TaskRow.tsx              ← single task row with checkbox, source dot, overdue badge
      CheckCircle.tsx          ← animated circle checkbox
      SectionLabel.tsx         ← uppercase section header

    effects/
      HeartsBurst.tsx          ← 5 floating pixel hearts overlay on LCD
      FoodBowl.tsx             ← animated food bowl that appears + fades
      MessageToast.tsx         ← speech-bubble toast above device for button C

    shared/
      AddBar.tsx               ← FAB (+) that expands into inline text input
```

---

## Step 3 — Shared types (`src/types/index.ts`)

```typescript
export type PetState = 'thriving' | 'happy' | 'neutral' | 'anxious' | 'sick' | 'dead';
export type CharacterId = 'blip' | 'buni' | 'nova';
export type ColorwayId = 'butter' | 'mint' | 'coral' | 'sky' | 'ube';
export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type MenuId = 'check' | 'pie' | 'dot';
export type TaskSource = 'template' | 'one-off';
export type EffectKind = 'purr' | 'feed';

export interface Task {
  id: string;
  title: string;
  overdue: boolean;
  overdueFrom?: string;
  overduePoints?: number;
  source: TaskSource;
  completed: boolean;
}

export interface ColorPalette {
  body: string;
  bodyDark: string;
  bodyHi: string;
}

export interface StateMeta {
  label: string;
  subtitle: string;
  tint: string;
  accent: string;
}

export interface CharacterDef {
  label: string;
  blurb: string;
  palette: Record<string, string>;
  normal: string[][];
  worried: string[][];
  sick: string[][];
  dead: string[][];
}

export interface Day {
  id: DayId;
  short: string;
  long: string;
  num: number;
  today?: boolean;
}
```

---

## Step 4 — Navigation wiring (`app/_layout.tsx`)

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="weekly"             options={{ presentation: 'modal' }} />
  <Stack.Screen name="character-chooser"  options={{ presentation: 'modal' }} />
</Stack>
```

**`app/index.tsx`** composes:
- `<HPHeader />` (hp, characterName, state, streak, canChoose, onOpenChooser)
- `<DeviceShell palette={...}>` containing `<LCDScreen>`, `<DeviceButtons>`
- `<TaskList />` in a `<ScrollView>`
- `<AddBar />` floating at bottom
- `<HeartsBurst />`, `<FoodBowl />`, `<MessageToast />` overlays
- Calendar button → `router.push('/weekly')`
- Character chooser → `router.push('/character-chooser')`

**`app/weekly.tsx`** renders `<WeeklyModal>` as a full-screen modal with a close button → `router.back()`.

**`app/character-chooser.tsx`** renders `<CharacterChooser>` full-screen, calling `router.back()` on pick/close.

---

## Step 5 — Component scaffold pattern

Every component file follows this pattern:

```tsx
// src/components/device/DeviceShell.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

interface Props {
  children: React.ReactNode;
  palette: ColorPalette;
}

export function DeviceShell({ children, palette }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>DeviceShell</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, color: '#999', opacity: 0.5 },
});
```

---

## Step 6 — Hook scaffold pattern

```typescript
// src/hooks/useHealth.ts
import { useMemo } from 'react';
import type { Task } from '../types';
import { computeHealth } from '../utils/health';

export function useHealth(tasks: Task[]): number {
  return useMemo(() => computeHealth(tasks), [tasks]);
}
```

---

## Files to create (in order)

1. Configure `app.json` — add expo-router plugin + scheme + entry
2. `src/types/index.ts` — all types
3. `src/constants/colors.ts` — DEVICE_PALETTES, LCD_INK, BEZEL, GLYPHS, BUTTON_DEFINITIONS
4. `src/constants/characters.ts` — CHARACTERS, STATE_TO_TEMPLATE (sprite data verbatim from design)
5. `src/constants/data.ts` — INITIAL_TASKS, STATE_META, DAYS, TEMPLATE, ONEOFFS
6. `src/constants/messages.ts` — MOTIVATIONAL_MESSAGES
7. `src/utils/health.ts` — computeHealth, stateForHealth, healthColor
8. `src/utils/messages.ts` — pickMessage
9. `src/hooks/useHealth.ts`, `usePetState.ts`, `useTasks.ts`, `usePetAnimation.ts`, `useEffectTimer.ts`
10. All 22 component stubs (device/, pet/, tasks/, effects/, shared/)
11. `app/_layout.tsx` — Stack navigator
12. `app/index.tsx` — main screen skeleton
13. `app/weekly.tsx` — weekly modal screen
14. `app/character-chooser.tsx` — character chooser screen

---

## Verification

After scaffolding:
```bash
npx expo start
```
- App opens with no crashes
- Main screen visible (placeholder labels where components will go)
- Tapping calendar button → navigates to weekly modal
- Weekly modal has back/close → returns to main
- Character chooser navigates and returns
- TypeScript: `npx tsc --noEmit` → 0 errors

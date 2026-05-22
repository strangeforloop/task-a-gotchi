# Task-a-gotchi

A virtual pet whose health is driven by completing a to-do list. Built with Expo SDK 54, expo-router v6, React Native 0.81.5, TypeScript strict mode.

**Design reference**: `Task-a-gotchi.html` and the `.jsx` files in the repo root are an HTML prototype — read them before implementing any UI component. They are the source of truth for colors, spacing, and interaction.

## Commands

```bash
npx expo start              # Metro bundler + QR code for Expo Go
npx expo start --web        # Run in browser (port 8744)
npx tsc --noEmit            # Type-check — must pass before committing
npm install --legacy-peer-deps  # Install deps (required — see below)
```

## File structure

```
app/                   expo-router screens — one file = one route
src/
  components/
    device/            Tamagotchi shell: DeviceShell, LCDScreen, buttons, glyphs
    pet/               Pet layer: PetSprite (pixel grid), HPHeader, CharacterChooser
    tasks/             Task list UI: TaskList, TaskRow, CheckCircle, SectionLabel
    effects/           Transient overlays: HeartsBurst, FoodBowl, MessageToast
    weekly/            Weekly plan bottom sheet
    shared/            Cross-cutting UI: AddBar (FAB + inline input)
  constants/           Pure data — no logic, no imports from hooks/components
  hooks/               Stateful logic — depends on constants + utils only
  utils/               Pure functions — no React, no side effects
  types/               Shared TypeScript types — imported by everything
```

## Architecture

**Pixel rendering** — `PetSprite` and `PixelGlyph` render dot-grid string arrays as `<View>` grids. No canvas, no SVG. `B`/`D`/`X` → ink color, `E`/`M` → transparent (LCD cutout effect). Cell size controls scale.

**Health formula** — `computeHealth()` in `src/utils/health.ts`. `HP = 100 − Σ(overduePoints for incomplete overdue tasks) + 5 bonus (if all today tasks done)`. All pet state is derived from this single number.

**Navigation** — expo-router Stack. `weekly` and `character-chooser` are `presentation: 'modal'` screens in `app/` — navigate with `router.push('/weekly')` and `router.push('/character-chooser')`, not by rendering them as components.

**Effect overlays** — `HeartsBurst` and `FoodBowl` are stub overlays (visible guard only, Reanimated animations not yet implemented). `useEffectTimer` controls which effect is active and auto-clears it after a timeout.

**`--legacy-peer-deps`** — Always required. `react-dom@19.1.0` has a peer conflict with a transitive `@radix-ui` dependency from expo-router's web support.

**`babel.config.js`** — Must exist with `react-native-reanimated/plugin` listed. Without it, Metro crashes on device with a worklets module resolution error.

## Best practices

- `src/constants/` — no React imports, pure data only
- `src/utils/` — no hooks, pure functions only
- New screens go in `app/` — no manual navigator registration needed
- Run `npx tsc --noEmit` before every commit
- Match the HTML prototype visually — it is the source of truth

## Testing

No test runner is configured yet. When ready:

```bash
npm install jest-expo@~54.0.17 --save-dev
```

**Priority test targets** (in order):

1. `src/utils/health.ts` — `computeHealth`, `stateForHealth`, `healthBarColor` are pure functions with no setup needed
2. `src/hooks/useTasks.ts` — `toggleTask` and `addTask` can be tested with `renderHook` from `@testing-library/react-hooks`
3. `src/components/tasks/TaskList.tsx` — render with overdue + today tasks, assert section labels appear

**What to test**: behaviour, not styling. Does checking a task update HP? Does HP === 100 unlock the character chooser?

**Navigation tests**: use `expo-router/testing-library` (ships with expo-router v6).

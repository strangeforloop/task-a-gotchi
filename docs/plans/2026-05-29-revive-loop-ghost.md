# Task-a-gotchi — Roadmap & Active Build Plan

> Working plan. Phases A (useful/safe) → B (creative depth) → C (ship + portfolio).
> The **▶ ACTIVE BUILD** section is the detailed spec for the feature currently being implemented.

## Vision
A virtual pet (Tamagotchi) whose **survival is driven by completing real tasks & habits**.
Mood/interactions are a non-lethal "fun" layer on top. Local-only v1, architected sync-ready.
Ship to real users **and** stand as a portfolio piece (hosted web demo + README case study).

## Phase A — useful & safe (correctness first)
- ✅ Fix non-persistence (local-date getIsoDate).
- ✅ Gate chooser on hp === 100.
- ✅ Real dead state (hpZeroSince -> deadHours).
- ✅ Shared usePetHp.
- ✅ First-run onboarding (empty store, suggested-habit picker).
- ✅ Mood/affinity layer (non-lethal).

## Phase B — creative depth
- ▶ **Revive loop + shared ghost (task #15)** — ACTIVE BUILD (spec below).
- Juicy interactions / finish effect animations (task #13).
- Pet evolution: egg -> baby -> teen -> adult via streak (task #14).
- Stats / insights view (task #16).

## Phase C — ship + portfolio
- Supporting work (task #17): reminders (expo-notifications), edit habits/tasks,
  settings + export, EAS distribution, hosted web demo, README case study.

## ▶ ACTIVE BUILD — Revive loop + shared ghost (task #15)

### Behaviour
- When the pet has been dead (HP=0) for **48h**, it becomes a **Ghost**.
- While a ghost, completing **3 tasks** revives it (no time limit on the revival itself).
- Reviving resets: HP recovers, ghost clears, hpZeroSince cleared, reviveProgress back to 0.

### Sprite (shared 8-bit ghost for ALL characters)
- Add `GHOST_FRAMES` to `src/constants/characters.ts`: 18×18, 2-frame bob.
  `'B'` = body ink, `'E'` = cutout eyes (transparent), space = empty.
- In `PetSprite.tsx`, branch on **`displayState === 'dead'`** -> render GHOST_FRAMES
  (shared across blip/buni/nova), 2-frame bob animation like the other states.

### Data / logic
- `src/utils/revive.ts`: `REVIVE_GOAL = 3`; `advanceRevive(progress) ->
  { reviveProgress, resurrected }` (resurrected true when progress+1 >= GOAL).
- `ProfileStore.reviveProgress` (read with `?? 0` for back-compat).
- `recordRevive(): boolean` in `ProfileContext` — increments progress; on resurrect
  also sets `hpZeroSince = null`; returns whether it resurrected.
- **Latch fix:** `useDeadStateTracker(hp, deadHours)` — only clear `hpZeroSince`
  when `hp > 0 && deadHours < 48`; once `>= 48` stay latched (else first completed
  task auto-revives before the ghost even appears, breaking the 3-task rule).

### UI wiring
- `app/index.tsx` `onToggle` is the single funnel: if a tap completes a task AND
  `state === 'dead'`, call `recordRevive()`; on `true` fire celebration
  (`HeartsBurst` / `playEffect`) + "✨ Revived!" toast.
- Wire existing `src/components/device/RevivalChip.tsx` ("Revive N/3") when dead.

### Tests
- `revive.test.ts`: advanceRevive increments; resurrects exactly at 3; idempotent
  past goal.
- `framesFor` test: dead state returns GHOST_FRAMES for every character.

### Acceptance
- Dead 48h -> ghost sprite shows for any character.
- Completing 3 tasks while ghost -> celebration + revived, HP > 0, chooser still
  gated until hp === 100.
- A single task completion never auto-revives a freshly-dead (>=48h) pet.

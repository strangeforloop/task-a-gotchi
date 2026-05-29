# Task-a-gotchi — Session Handoff

> Handoff for starting a fresh session. Snapshot of what's done, what's next, and the context
> needed to continue without re-deriving everything.

## What this app is
Expo SDK 54 / expo-router v6 / RN 0.81.5 / TypeScript strict. A virtual pet (Tamagotchi) whose
**HP is driven by completing real tasks & habits**. Repo: `/Users/fr-qlab01/Projects/task-a-gotchi`.

## Goal & direction (decided with user)
- **Local-only v1** (no accounts/backend), but architected **sync-ready**.
- Ship to real users **and** make it a **portfolio piece** (so a hosted web demo + README matter).
- **Focus = the creative game side**: Tamagotchi feel, habits, *keeping it alive*, fun.
- **Survival is tied to real tasks/habits ONLY.** Mood/interactions are a non-lethal "fun" layer.

## Roadmap / plan file
Full roadmap + detailed next-feature spec lives at:
`/Users/fr-qlab01/.claude/plans/run-through-the-app-ancient-hamster.md`
(Phases A=useful/safe, B=creative depth, C=ship+portfolio. The "▶ ACTIVE BUILD" section has the
detailed revive-loop + ghost spec.)

## ✅ Done & verified this session
All verified with `npx tsc --noEmit`, eslint (clean on touched files; 4 pre-existing
inline-style warnings remain), and `npx jest` (**128 tests passing**).

**Phase 1 — correctness bugs**
- **Non-persistence root cause fixed:** `getIsoDate` (`src/utils/weeklyPlan.ts`) used UTC
  (`toISOString`) while the app uses local time → evening edits saved under the wrong day AND a
  false "new week" reset wiped tasks. Now formats the **local** date. ⚠️ Do not reintroduce `toISOString`.
- Chooser gated: `canChoose={hp === 100}` (`app/index.tsx`).
- Real dead state: persisted `hpZeroSince` → `deadHours` via new `useNow`; `usePetState(hp, deadHours)`.
- Shared `usePetHp()` so Home & Profile HP can't diverge.
- `src/utils/storage.ts` `writeStore` logs write errors (no longer swallowed); ProfileContext
  stale-closure clobber fixed (functional updates).
- Date-helper dedupe + stale comment fix in `WeeklyPlanContext`.

**Phase 2.1 — first-run onboarding**
- `buildInitialStore` now returns an **empty** store (no fake demo data) → new users start at 100 HP.
- `src/constants/suggestedHabits.ts` (`SUGGESTED_HABITS`, all daily, no scheduled time).
- `app/onboarding.tsx` — skippable predefined-habit picker (reuses `CheckCircle`, `addHabit`).
- `ProfileContext`: `onboarded` + `hydrated` flags; `app/index.tsx` redirects to `/onboarding`
  when `hydrated && !onboarded`. `TaskList` empty state added.
- Deleted dead code: `src/hooks/useTasks.ts`, `INITIAL_TASKS`, `DAYS`.

**Bug fix — duplicate React keys**
- `src/utils/id.ts` `uid()` collision-proof id generator (Date.now collided in onboarding's
  synchronous add loop). Used in `addHabit`, `addTask`, `addOneoff`.
- `HabitContext` dedupes habits by id on load + re-persists (cleans already-saved duplicates).

**Phase B — mood/affinity (the first "fun" layer)**
- `src/utils/mood.ts` (pure, tested): mood 0–100; interactions boost (play +25 / feed +20 /
  pet +15 / talk +5); decays ~2/hr; **never lethal**.
- `ProfileStore.mood` + `moodUpdatedAt`; `recordInteraction(kind)` in `ProfileContext`.
- A/B/C buttons (`app/index.tsx`) call `recordInteraction`.
- `usePetMood()` hook; 💗 Mood bar on `app/profile.tsx`. `mood.test.ts` (9 tests).

## ▶ NEXT (planned, NOT yet implemented) — Revive loop + shared ghost (task #15)
User approved building it. Full spec in the plan file's ACTIVE BUILD section. Summary:
- Dead pet (HP=0 for 48h) becomes a **Ghost**; completing **3 tasks** revives it (no time limit).
- **Shared 8-bit ghost for ALL characters** when dead: add `GHOST_FRAMES` to
  `src/constants/characters.ts` (18×18, 2-frame bob, `'B'` body, `'E'` cutout eyes); in
  `PetSprite.tsx` branch on **`displayState === 'dead'`** to use it.
- `src/utils/revive.ts`: `REVIVE_GOAL=3`, `advanceRevive(progress)→{reviveProgress, resurrected}`.
- `ProfileStore.reviveProgress` (read `?? 0`); `recordRevive(): boolean` in `ProfileContext`
  (on resurrect also sets `hpZeroSince=null`).
- **Latch fix:** `useDeadStateTracker(hp, deadHours)` — only clear `hpZeroSince` when
  `hp>0 && deadHours<48`; once `>=48` stay latched (else first task auto-revives, breaking the rule).
- `app/index.tsx` `onToggle` (single funnel): if tapping completes a task AND `state==='dead'`,
  call `recordRevive()`; on `true` fire celebration (`HeartsBurst`/`playEffect`) + "✨ Revived!" toast.
- Wire existing `src/components/device/RevivalChip.tsx` ("Revive N/3") when dead.
- Tests: `revive.test.ts`, a `framesFor` test.

**Other pending tasks:** #13 juicy interactions/finish effect animations, #14 pet evolution
(egg→baby→teen→adult via streak), #16 stats/insights view, #17 supporting work (reminders via the
already-installed `expo-notifications`, editing habits/tasks, settings+export, EAS distribution,
hosted web demo, README case study).

## ⚠️ Git status — IMPORTANT
**Nothing has been committed this session.** All changes are uncommitted on the working tree.
The user asked to run **`save-plan`** (checkpoint code → write plan to `docs/plans/` → commit &
push to GitHub) — **this was NOT completed.** `MISTAKES.md` mandates `/save-plan` after planning.
Do this early in the next session (verify a git remote exists first).

## Verify / run
```bash
cd /Users/fr-qlab01/Projects/task-a-gotchi
npx tsc --noEmit
TZ=America/Los_Angeles npx jest
npx eslint 'app/**/*.tsx' 'src/**/*.{ts,tsx}'   # 4 pre-existing inline-style warnings = OK
npx expo start --web                             # port 8081; another instance may already be running
# npm install --legacy-peer-deps  (always needs --legacy-peer-deps)
```

## Gotchas
- `getIsoDate` must stay **local** (never `toISOString`).
- Calling `Date.now()` **during render** trips the `react-hooks/purity` lint error — use the
  `useNow` hook or a `useState(() => Date.now())` initializer instead.
- `npm install` requires `--legacy-peer-deps`.
- `babel.config.js` must keep `react-native-reanimated/plugin` or Metro crashes.

## Architecture quick map
- `app/`: expo-router screens — `index`, `onboarding`, `weekly`, `profile`, `character-chooser`,
  `_layout`. Providers nest **WeeklyPlan → Habit → Profile** (Profile innermost).
- `src/context/`: `WeeklyPlanContext` (key `task-a-gotchi:weekly-v2`), `HabitContext`
  (`habits-v1`), `ProfileContext` (`profile-v1`). All persist via `writeStore`.
- `src/hooks/`: `usePetHp`, `useDeadStateTracker`, `useNow`, `usePetMood`, `usePetState`,
  `useHealth`, `useEffectTimer`, `usePetAnimation`.
- `src/utils/`: `weeklyPlan`, `health`, `habits`, `streak`, `mood`, `storage`, `id`, `format`,
  `messages` (most are pure + unit-tested in `src/__tests__/`).
- `src/components/`: `device/`, `pet/`, `tasks/`, `effects/`, `weekly/`, `shared/`.
- Pet sprites: pixel grids in `src/constants/characters.ts` (chars: blip/buni/nova; states map via
  `STATE_TO_TEMPLATE`). HP→state via `stateForHealth` in `src/utils/health.ts`.

## User preferences (persisted in memory)
- Ask before adding to `docs/learning/concepts.md` (don't auto-add).
- Prefers **conversational clarification** over the AskUserQuestion multiple-choice tool.
- Prioritize the **creative Tamagotchi game side**; local-only v1 + portfolio.

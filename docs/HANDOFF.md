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

## Roadmap / docs (authoritative)
The forward plan and design rationale now live in-repo (all dated 2026-06-03):
- `docs/ROADMAP.md`: Shipped / Now / Next / Later horizons. **This is the source of truth for
  what to build next.**
- `docs/architecture/ARCHITECTURE.md`: how it's built.
- `docs/architecture/DECISIONS.md`: why (decision log).

The old plan file `/Users/fr-qlab01/.claude/plans/run-through-the-app-ancient-hamster.md` is now
historical/superseded; prefer `docs/ROADMAP.md`.

## ✅ Shipped since last handoff (now on `main`)
The doc below previously listed the revive loop as "next" and the tree as uncommitted. Both are
stale. Build is green: `npx tsc --noEmit` clean, **141 tests across 11 files** (was 128). Landed
commits (head `6b44654`, 2026-06-03), mirroring `docs/ROADMAP.md` Shipped:
- `c94309c`: **Revive loop + shared 8-bit ghost (#15).** Dead 48h, then ghost, then 3 tasks
  revive. Added `src/utils/revive.ts`, `GHOST_FRAMES` in `characters.ts`, `RevivalChip` wiring,
  `ProfileStore.reviveProgress`, `useDeadStateTracker` latch.
- `06dda95`: "from \<day\>" tag on completed overdue tasks (`TaskRow`).
- `9efe48f`: edit habits (title / frequency / time) + keyboard-avoidance in the weekly modal.
- `05677f9` / `c5c5c20`: architecture decision log, architecture diagram, and `ROADMAP.md`.
- `ab6108b` (closed #1) + `6b44654`: schedule-aware, local-date habit streaks; today counts as
  pending, not a miss.

## ✅ Done & verified (earlier session, kept for context)
All verified with `npx tsc --noEmit`, eslint (clean on touched files; 4 pre-existing
inline-style warnings remain), and `npx jest`.

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

## ▶ NEXT (from `docs/ROADMAP.md` "Now")
The revive loop (#15) is **done** (see above). Current next-up:
- **Part 2: home-row 🔥 streak badge.** Surface per-habit streak on the home task rows (today it
  only shows in the weekly modal). Thread `habitStreak` through `Task` from `HabitContext`; render
  in `TaskRow`. Small; streak math is already correct post-#1.
- **Part 3: stats screen (habits only).** Dedicated modal: multi-week heatmap, completion rate,
  longest streak. Pure helpers in `src/utils/habits.ts` (local dates). Portfolio centerpiece;
  habit history already persists, so no migration.

**Further out** (see ROADMAP Next/Later): rollover taxonomy (#2: which tasks lapse vs carry),
edit/manage parity for weekly templates & one-offs, reminders via the already-installed
`expo-notifications`, pet evolution (egg, baby, teen, adult), settings + export/import, persistence
repo + schema migrations, and ship work (EAS, hosted web demo, README case study).

## Git status
Working tree **clean**: all work above is committed. On `main`, in sync with
`origin/main` (nothing unpushed). Remote: `https://github.com/strangeforloop/task-a-gotchi.git`.

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
  (`habits-v1`), `ProfileContext` (`profile-v1`, holds `mood` + `reviveProgress`, exposes
  `recordRevive()`). All persist via `writeStore`.
- `src/hooks/`: `usePetHp`, `useDeadStateTracker` (latches dead once `deadHours>=48`), `useNow`,
  `usePetMood`, `usePetState`, `useHealth`, `useEffectTimer`, `usePetAnimation`.
- `src/utils/`: `weeklyPlan`, `health`, `habits`, `streak`, `mood`, `revive` (`REVIVE_GOAL=3`,
  `advanceRevive`), `storage`, `id`, `format`, `messages` (most are pure + unit-tested in
  `src/__tests__/`).
- `src/components/`: `device/` (incl. `RevivalChip` "Revive N/3"), `pet/`, `tasks/`, `effects/`,
  `weekly/`, `shared/`.
- Pet sprites: pixel grids in `src/constants/characters.ts` (chars: blip/buni/nova; states map via
  `STATE_TO_TEMPLATE`). HP→state via `stateForHealth` in `src/utils/health.ts`. When
  `displayState === 'dead'`, `PetSprite` renders the shared `GHOST_FRAMES` for all characters.

## User preferences (persisted in memory)
- Ask before adding to `docs/learning/concepts.md` (don't auto-add).
- Prefers **conversational clarification** over the AskUserQuestion multiple-choice tool.
- Prioritize the **creative Tamagotchi game side**; local-only v1 + portfolio.

---
_Snapshot reflects head `6b44654`, dated 2026-06-03._

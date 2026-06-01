# Architecture & Design Decisions

A running log of the non-obvious design decisions in Task-a-gotchi and the edge cases that
shaped them. Lightweight by intent — each entry is **Decision / Context / Edge cases / Status**,
not full ADR ceremony. Companion to [`../../MISTAKES.md`](../../MISTAKES.md) (which records
specific bugs and their lessons).

---

## 1. Two separate persistence stores

**Decision.** Habits and the weekly plan live in two independent AsyncStorage stores:
`task-a-gotchi:habits-v1` (`HabitContext`) and `task-a-gotchi:weekly-v2` (`WeeklyPlanContext`).

**Context.** The weekly plan is intentionally ephemeral — on a new week, `WeeklyPlanContext`
keeps recurring templates but resets one-off tasks and that week's completions. Habits are the
opposite: they are long-running commitments whose entire point is history (streaks, heatmaps).
Putting them in one store would force one reset policy on both.

**Edge cases.**
- Habit completion history therefore **persists indefinitely** — week rollover never touches it.
  This is why "progress over time" (a future Stats screen) needs no migration: the data is
  already there.
- The overall daily 🔥 streak (weekly-plan based) *does* reset weekly by design; the per-habit
  streak does not. Two different "streak" concepts — don't conflate them.

**Status.** Stable.

---

## 2. Local dates, never UTC

**Decision.** All date keys are **local** calendar dates via `getIsoDate` (`src/utils/weeklyPlan.ts`),
never `Date.toISOString()`.

**Context.** An early bug used `toISOString()` (UTC) for the "today" key. For users behind UTC,
evening edits were filed under the *next* day, and a spurious "new week" check wiped tasks. The
rule since: format the **local** date.

**Edge cases.**
- Anything that compares "did this happen today/this day" must build its key the same way, or it
  drifts by one near midnight.
- ⚠️ **Known violation:** `computeHabitStreak` and `buildHabitDots` still use `toISOString()`.
  Tracked in [issue #1](https://github.com/strangeforloop/task-a-gotchi/issues/1) and to be fixed
  alongside the streak-schedule bug.

**Status.** Enforced for new code; two legacy violations open (#1).

---

## 3. Habit streak semantics

**Decision.** A habit's current streak counts back over its **scheduled** days only: days the
habit was not scheduled are **skipped** (they don't extend or break the streak); a **missed
scheduled day resets** it.

**Context.** The original `computeHabitStreak` broke on the first calendar day with no completion,
ignoring the schedule — so "weekdays" habits broke every weekend and "specific-days" habits
almost never built a streak. That made streaks *look* like they reset at each week boundary.

**Edge cases.**
- Weekend on a weekdays habit → skipped, streak survives.
- A genuinely missed weekday → resets.
- Specific-days (e.g. Mon/Wed/Fri) → only those days count.

**Status.** Behavior agreed; implementation pending in
[issue #1](https://github.com/strangeforloop/task-a-gotchi/issues/1).

---

## 4. HP is survival; Mood is a non-lethal layer

**Decision.** Two pet stats with deliberately different power. **HP** is driven only by real
tasks/habits and is the *only* thing that can kill or revive the pet. **Mood** rises with
interactions (pet/feed/play/talk) and decays gently with time, but can never drop the pet to death.

**Context.** The product thesis is "completing real work keeps your pet alive." If interactions
could keep a pet alive, the productivity signal would be gameable. Mood exists for fun/expression
without undermining that.

**Edge cases.**
- Mood decay is capped and never reaches a lethal state.
- HP and mood are surfaced separately on the profile so they read as distinct systems.

**Status.** Stable.

---

## 5. Dead → Ghost latch (revive loop)

**Decision.** When HP has been 0 for ≥48h the pet becomes a **Ghost**, and only completing 3 tasks
(`recordRevive`) brings it back. While `deadHours >= 48`, `useDeadStateTracker` will **not**
auto-clear `hpZeroSince` on the first HP bump.

**Context.** Without the latch, the very task that revives the pet would also be the one nudging
HP above 0, so `hpZeroSince` would clear and the pet would "auto-revive" before the player did the
3-task ritual — defeating the mechanic.

**Edge cases.**
- Inside the 48h grace window, HP recovery *does* clear the dead clock (normal recovery).
- On successful revive, `recordRevive` clears `hpZeroSince` so HP recomputes from completed tasks.

**Status.** Stable.

---

## 6. Shared ghost sprite for all characters

**Decision.** A single `GHOST_FRAMES` sprite renders for *any* character once dead, selected via a
pure `framesFor(charDef, state, tmpl)` that returns the ghost for `state === 'dead'`.

**Context.** Death is a shared identity beat; authoring a bespoke ghost per character adds work for
no gameplay value. The pure selector keeps `PetSprite` simple and unit-testable.

**Status.** Stable.

---

## 7. Editing a habit preserves identity

**Decision.** `updateHabit(id, patch)` merges title/frequency/days/time but **keeps `id` and
`createdAt`**.

**Context.** Streaks and history key off the habit `id` and the completion dates. Editing a habit
(fixing a typo, changing the time) must not look like deleting and recreating it — that would
orphan its history and reset the streak.

**Edge cases.**
- Changing frequency away from `specific-days` drops the now-meaningless `daysOfWeek`.
- Clearing the scheduled time drops the field (so the "late" nudge logic doesn't fire).

**Status.** Stable.

---

_Last updated: 2026-06-01._

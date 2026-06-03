# Roadmap

Where Task-a-gotchi is headed. Organized by horizon, not hard dates. Companion to
[`architecture/ARCHITECTURE.md`](./architecture/ARCHITECTURE.md) (how it's built) and
[`architecture/DECISIONS.md`](./architecture/DECISIONS.md) (why).

> **Maintenance:** when an item ships, move it to **Shipped** with its commit/PR. When a new
> direction is decided, add it under the right horizon. Link GitHub issues by number. Keep
> "Now" to a small, honest set — this is a working plan, not a wishlist.

**Product north star:** a virtual pet whose survival is driven by completing *real* tasks and
habits. Local-first v1, architected sync-ready. Doubles as a portfolio piece (hosted demo + the
craft on display: tested pure-function core, documented decisions, accessible UI).

---

## ✅ Shipped

| Item | Ref |
|---|---|
| First-run onboarding, mood layer, real dead-state tracking, correctness fixes | `08e264f` |
| Revive loop + shared 8-bit ghost (dead 48h → ghost → 3 tasks revive) | `c94309c` |
| "from \<day\>" tag on completed overdue tasks | `06dda95` |
| Edit habits (title / frequency / time) + keyboard-avoidance in weekly modal | `9efe48f` |
| Architecture decision log | `05677f9` |
| Schedule-aware, local-date habit streaks | `ab6108b` (closed #1) |

---

## 🔜 Now (in flight / next up)

- **Part 2 — Home-row streak badge.** Surface per-habit 🔥 streak on the home task rows (today it
  only shows in the weekly modal). Thread `habitStreak` through `Task` from `HabitContext`; render
  in `TaskRow`. Small; streak math already correct post-#1.
- **Part 3 — Stats screen (habits only).** Dedicated modal: multi-week heatmap, completion rate,
  longest streak. Pure helpers in `utils/habits.ts` (local dates). Portfolio centerpiece. Habit
  history already persists, so no migration.

---

## 🔭 Next (decided direction, not yet scheduled)

- **[#2] Rollover taxonomy — which tasks lapse vs carry.** Ephemeral daily tasks (e.g. "wash face")
  shouldn't reappear as overdue the next day; deadline-bound tasks should. Needs a design decision
  on the signal (source vs explicit flag vs frequency) and penalty/visibility semantics *before*
  implementation. Tracked in [#2](https://github.com/strangeforloop/task-a-gotchi/issues/2).
- **Edit/manage parity.** Editing for weekly templates & one-offs (habits already editable);
  archive-vs-delete so history survives removal.
- **Reminders.** `expo-notifications` is installed + declared but unused — local notifications for
  habits with a scheduled time; pet-flavored copy; reschedule on edit. Verify on a dev build.

---

## 🌅 Later (horizon / portfolio)

- **Pet evolution & earned unlocks** — egg → baby → teen → adult via streak; characters/colorways
  as earned rewards.
- **Settings + data safety** — export/import JSON via RN `Share`, reset-all, privacy blurb.
- **Persistence repository + schema migrations** — formalize the `storage.ts` seam into a typed
  repo with versioned `migrate()`; the single insertion point for future sync/accounts.
- **Ship it** — EAS build profiles, store metadata; hosted `react-native-web` PWA demo for the
  portfolio; README case study (problem → solution → architecture → live demo).
- **Accessibility & polish pass** — ≥44px touch targets, roles/labels/state, reduced-motion,
  contrast; finish the effect-overlay animations.

---

## 🧹 Known debt / follow-ups

- Package versions slightly behind Expo's expected set (`expo`, `expo-router`, `typescript`,
  `@types/jest`) — bump when convenient.

---

_Last updated: 2026-06-03._

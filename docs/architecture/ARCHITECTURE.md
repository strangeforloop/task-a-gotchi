# Architecture

Visual map of how Task-a-gotchi is put together. Companion to
[`DECISIONS.md`](./DECISIONS.md) (the *why* behind specific calls) and
[`../ROADMAP.md`](../ROADMAP.md) (what's next).

> **Maintenance:** update this file in the same PR as any change to the layer boundaries,
> a context/store, the data model, or a core derivation (HP, streak, mood, revive). Diagrams
> are Mermaid — they render on GitHub. Keep them accurate over pretty; a stale diagram is worse
> than none.

---

## 1. System at a glance

A local-first Expo / React Native app. No backend — all state lives on-device in AsyncStorage,
behind a thin persistence seam so a future sync layer has a single insertion point.

```mermaid
graph TD
  subgraph Device["📱 On device"]
    UI["expo-router screens (app/)"]
    CTX["React Context providers (src/context/)"]
    DERIV["Derivation hooks (src/hooks/)"]
    PURE["Pure logic (src/utils/)"]
    STORE["AsyncStorage<br/>3 namespaced stores"]
  end

  UI --> CTX
  UI --> DERIV
  DERIV --> CTX
  DERIV --> PURE
  CTX --> PURE
  CTX <-->|writeStore / read| STORE

  classDef store fill:#1F2410,color:#B0BD78,stroke:#B0BD78;
  class STORE store;
```

---

## 2. Layered dependency rule

Strict one-direction dependency flow. The lower a layer, the more testable and the fewer
imports it's allowed. **`utils` and `constants` are React-free and side-effect-free** — that's
what keeps the core logic unit-tested without a renderer.

```mermaid
graph LR
  A["app/<br/>(screens, routing)"] --> B["components/<br/>(presentational)"]
  A --> C["context/<br/>(state + persistence)"]
  A --> D["hooks/<br/>(derivation)"]
  B --> D
  C --> D
  D --> E["utils/<br/>(pure functions)"]
  C --> E
  D --> F["constants/<br/>(static data)"]
  E --> F
  E --> G["types/"]
  C --> G

  classDef pure fill:#7BD389,color:#1F1A1A;
  class E,F,G pure;
```

**Rules of thumb**
- `constants/` — pure data, no imports from `hooks`/`components`/`context`.
- `utils/` — pure functions; no React, no side effects. Everything here has (or should have) a unit test.
- `hooks/` — stateful derivation; depend on `context` + `utils` + `constants` only.
- `components/` — presentational; receive data via props, don't reach into context where avoidable
  (e.g. `TaskRow` takes a `Task`, it doesn't call `useHabits`).
- `app/` — screens wire it all together; one file = one route (expo-router).

---

## 3. Navigation (expo-router)

Providers nest at the root (`app/_layout.tsx`) in the order **WeeklyPlan → Habit → Profile**
(Profile innermost). Screens are a Stack; three are modals.

```mermaid
graph TD
  L["_layout.tsx<br/>WeeklyPlanProvider › HabitProvider › ProfileProvider"]
  L --> IDX["index<br/>(home / device)"]
  L --> ONB["onboarding<br/>(first-run habit picker)"]
  IDX -->|push| WK["weekly *(modal)*<br/>plan + habits tabs"]
  IDX -->|push| PR["profile *(modal)*<br/>HP / mood / streak"]
  IDX -->|push| CC["character-chooser<br/>*(transparent modal)*"]
  IDX -->|redirect when !onboarded| ONB
```

---

## 4. State & persistence

Three independent contexts, each owning one AsyncStorage key and persisting through the shared
`writeStore` seam (`src/utils/storage.ts`). The split is deliberate — see
[DECISIONS §1](./DECISIONS.md) (two-store persistence).

```mermaid
graph TD
  subgraph Contexts
    WP["WeeklyPlanContext"]
    HB["HabitContext"]
    PF["ProfileContext"]
  end
  subgraph AsyncStorage
    K1["task-a-gotchi:weekly-v2<br/>(resets weekly)"]
    K2["task-a-gotchi:habits-v1<br/>(persists forever)"]
    K3["task-a-gotchi:profile-v1<br/>(character, hp clock, mood, revive)"]
  end
  WP -->|writeStore| K1
  HB -->|writeStore| K2
  PF -->|writeStore| K3
```

| Context | Key | Owns | Reset policy |
|---|---|---|---|
| `WeeklyPlanContext` | `weekly-v2` | templates, one-offs, daily completions, week start | One-offs + completions wiped on week rollover; templates kept |
| `HabitContext` | `habits-v1` | habit definitions + dated completions | Never wiped (history is the point) |
| `ProfileContext` | `profile-v1` | character, colorway, `hpZeroSince`, mood, `reviveProgress`, onboarded | Never wiped |

---

## 5. The core derivation: HP → pet state

The pet is a pure function of completed work. This is the spine of the app.

```mermaid
flowchart TD
  WT["weekly tasks<br/>(deriveTasksForToday)"] --> HEALTH
  OH["overdue habit tasks<br/>(buildOverdueHabitTasks)"] --> HEALTH
  HB["habit bonus / late penalty<br/>(computeHabitBonus)"] --> HEALTH
  HEALTH["usePetHp → useHealth → computeHealth()"] --> HP(("HP 0–100"))
  HP --> DEAD["useDeadStateTracker<br/>(stamps hpZeroSince, 48h latch)"]
  DEAD --> DH["deadHours"]
  HP --> STATE
  DH --> STATE
  STATE["usePetState → stateForHealth()"] --> PS["PetState<br/>thriving…sick / dead"]
  PS --> SPRITE["PetSprite (framesFor)<br/>dead ⇒ shared GHOST_FRAMES"]
  RP["reviveProgress<br/>(recordRevive, 3 tasks)"] --> DEAD

  classDef hp fill:#E24B4A,color:#fff;
  class HP hp;
```

Key invariants (detailed in DECISIONS):
- **HP is the only lethal stat.** Mood is a parallel, non-lethal layer (`usePetMood`).
- **Dead latch:** once `deadHours ≥ 48` the pet is a ghost; only `recordRevive` (3 tasks) clears it.
- **Streaks are schedule-aware & local-date** (issue #1, resolved).

---

## 6. Module index

| Area | Files (representative) | Responsibility |
|---|---|---|
| Screens | `app/index`, `app/weekly`, `app/profile`, `app/onboarding` | Routing + wiring |
| Device shell | `components/device/*` | Tamagotchi LCD frame, buttons, glyphs |
| Pet | `components/pet/*` | Sprite rendering, HP header, chooser |
| Tasks | `components/tasks/*` | Task list, rows, check circle, habit dots |
| Effects | `components/effects/*` | Hearts burst, food bowl, toast |
| State | `context/*` | The three providers above |
| Derivation | `hooks/*` | `usePetHp`, `usePetState`, `useDeadStateTracker`, `usePetMood`, `useNow`, … |
| Pure logic | `utils/*` | `health`, `habits`, `streak`, `mood`, `revive`, `weeklyPlan`, `storage`, `id`, `format` |
| Static data | `constants/*` | `characters` (sprites), `colors`, `messages`, `suggestedHabits`, `data` |
| Types | `types/index.ts` | Shared TS types |
| Tests | `__tests__/*` | Unit tests for the pure layer |

---

_Last updated: 2026-06-03._

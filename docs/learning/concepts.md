# Concepts

A running glossary of programming concepts encountered while building Task-a-gotchi.

## Context value memoization

**What it is**: Wrapping the object you pass to a React Context `Provider`'s `value` prop in `useMemo`, so it keeps the same reference between renders unless its inputs change.

**Why it matters**: Every consumer of a context re-renders whenever the `value` *reference* changes — even if the data inside is identical. If you build a fresh object literal on every provider render (`value={{ a, b, fn }}`), all consumers re-render every time the provider re-renders, defeating the point of splitting logic into context.

```tsx
// ❌ New object every render → every useHabits() consumer re-renders
const value = { habits, toggleHabit, addHabit };
return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;

// ✅ Stable reference; only changes when a dependency actually changes
const value = useMemo(
  () => ({ habits, toggleHabit, addHabit }),
  [habits, toggleHabit, addHabit],
);
```

**Gotcha**: This only helps if the functions inside (`toggleHabit`, etc.) are *also* stable — wrap them in `useCallback`. A `useMemo` value that depends on a function recreated every render gains nothing. (Task-a-gotchi already uses `useCallback` for its handlers, so adding `useMemo` to the value is the missing piece.)

## expo-router typed routes

**What it is**: An expo-router feature that generates TypeScript types for every route in `app/`, so `router.push('/weekly')` is checked against real routes and autocompletes. Enabled via `experiments.typedRoutes: true` in `app.json` (stable as of SDK 53+).

**Why it matters**: Without it, route strings are just `string` — a typo like `router.push('/wekly')` compiles fine and fails at runtime. With typed routes, it's a compile error, and you get autocomplete for paths and params.

```jsonc
// app.json
{ "expo": { "experiments": { "typedRoutes": true } } }
```

**Gotcha**: Types are regenerated when Metro runs (`expo start`) or via `expo customize`. If a new route's type isn't recognized, restart the dev server so the `.expo/types` are rebuilt.

## React Compiler (React 19)

**What it is**: A build-time compiler that automatically memoizes components and hook values, removing the need to hand-write most `useMemo`, `useCallback`, and `React.memo`. Opt-in in Expo via `experiments.reactCompiler: true`.

**Why it matters**: As of 2026 it's the recommended default for new React 19 / RN 0.81 apps. It gets memoization correct by analyzing your code, so you stop manually maintaining dependency arrays (a common source of stale-closure bugs) while keeping re-renders minimal.

```jsonc
// app.json — requires babel-plugin-react-compiler installed
{ "expo": { "experiments": { "reactCompiler": true } } }
```

**Gotcha**: It only optimizes components that follow the Rules of React (no mutating props/state during render, hooks called unconditionally). Code that breaks those rules is silently skipped — install the `eslint-plugin-react-hooks` recommended ruleset (which now includes the compiler's lint rules) to catch bail-outs. You can adopt incrementally; existing manual `useMemo`/`useCallback` stay valid.

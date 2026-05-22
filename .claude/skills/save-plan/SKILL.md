---
name: save-plan
description: Snapshots uncommitted work, writes the implementation plan to docs/plans/, commits the plan, and pushes both commits to GitHub. Use before starting implementation to create a clean checkpoint.
disable-model-invocation: true
allowed-tools: Bash Write Read
---

You are executing the `/save-plan` skill. Follow these five steps in order.

---

## Step 1 — Pre-plan commit (conditional)

Run `git status --porcelain` to check for uncommitted changes.

- If the output is **non-empty** (staged, unstaged, or untracked files exist):
  1. Run `git add -A`
  2. Commit: `git commit -m "checkpoint: pre-plan state"`
  3. Print: `✓ Pre-plan checkpoint committed.`
- If the output is **empty** (working tree is clean):
  - Print: `Working tree is clean — skipping pre-plan commit.`

---

## Step 2 — Write the plan file

1. Get the current timestamp: run `date +%Y-%m-%d-%H%M%S` and capture the output.
2. Construct the file path: `docs/plans/plan-<timestamp>.md`
3. Use the **Write** tool to create that file. Derive the content from the current conversation:

```
# <Title: one sentence describing what we're building>

## Key Decisions

- <decision 1 agreed in conversation>
- <decision 2 agreed in conversation>
- ...

## File / Component Structure

<agreed file tree with a one-line purpose per entry>

## Implementation Order

1. <first step>
2. <second step>
3. ...
```

Print: `✓ Plan written to docs/plans/plan-<timestamp>.md`

---

## Step 3 — Post-plan commit

1. `git add docs/plans/plan-<timestamp>.md`
2. `git commit -m "plan: <short description of what we're building>"`
3. Print: `✓ Plan committed.`

---

## Step 4 — Push to GitHub

1. Detect the current branch: `git rev-parse --abbrev-ref HEAD`
2. Push: `git push origin <branch>`
3. Print: `✓ Pushed to origin/<branch>.`

---

## Step 5 — Confirm

Run `git log --oneline -3` and print the output so the user can see both new commits.

Print a final summary line, e.g.:

```
Done. 2 commits pushed to origin/main.
  8a1f3c2  plan: <description>
  4e9d01a  checkpoint: pre-plan state
```

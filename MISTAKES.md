# Mistakes & Lessons

A running log of process errors to avoid repeating. Updated whenever a mistake is caught.

---

## 1 — Always run `/save-plan` after planning

**What happened:** After agreeing on an implementation plan in conversation ("the weekly plan with templates and one-off tasks, overdue rolling forward"), Claude started implementing immediately without saving the plan first. The plan document was only created later as an afterthought.

**Rule:** Whenever a planning conversation ends and implementation is about to start, run `/save-plan` **before writing any code**. The skill:
1. Commits any uncommitted work as a clean checkpoint (`checkpoint: pre-plan state`)
2. Writes a structured plan to `docs/plans/plan-<timestamp>.md`
3. Commits and pushes the plan file

**Why this matters:**
- The plan becomes a permanent, reviewable record of decisions made
- If implementation diverges, the plan shows what was originally agreed
- The pre-plan commit creates a rollback point before any changes land

**When to apply:** Every time Anna and Claude agree on a feature/task in chat → `/save-plan` → then implement.

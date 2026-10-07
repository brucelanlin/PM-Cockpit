# CHANGELOG

Meaningful changes to the skill system, and why.

---

## 2026-10-07 — Generic release

The skills were first written for one team's Jira setup. This release makes them reusable on any product without editing the skills.

### Added: `project-context.md`
All product and Jira specifics (personas, workflow, paths, repos, project keys, board, field IDs, link types, context blocks) now live in one file. Skills refer to its values as `{{PLACEHOLDER}}`s. It ships with a fictional example product.

### Renamed
- Primary skill → `pm-cockpit`
- Sprint planning skill → `sprint-planning`
- AC audit workflow → `ac-field-audit` (now takes `project`, `acField` and `jiraMcp` as arguments, and pages through the project instead of using hard-coded key ranges)

### Added: Evidence and source order
Claims resolve in a fixed order (PO decision → live Jira → PRD → registry, research, code). Disagreements are surfaced. Confirmed, proposed and unknown are kept distinct.

### Added: Conditional PRD precedence and reconciliation
"PRD always wins" rotted as the PRD drifted from the backlog. PRD authority now depends on its `Updated` date: fresh (≤ 4 weeks), review-due (4–8), stale (> 8). When stale, live Jira decides what exists and the skill proposes section-level PRD updates for approval.

### Added: Decision log
An append-only log records applied scope decisions and PRD reconciliations, so the reason behind a change survives across sessions.

### Added: Interview and confirmation gate for new features
In line with spec-driven development: new or vague features get one question per turn, locked definitions, and a restate-and-confirm step before the spec is drafted. Routine story work keeps batched questions.

### Added: Edge cases in AC and the INVEST audit
AC must cover empty or invalid input, dependency failures, permissions and limits, or list them as out of scope.

### Added: Story overlap search
Stories are checked against existing stories by text search, not only at feature level, and overlapping ones are linked.

### Added: Rules for claims about code
Check integration branches and dependency manifests; never state that something doesn't happen based on an empty search alone.

### Changed: Short story format
Stories default to persona, background, in scope, out of scope and size. Open questions, the story's origin, INVEST tables and size rationale stay in chat.

### Changed: Confirmation ladder and write integrity
One confirmation before the first Jira write, no double-asking. Every write is verified with a re-read; an empty 204 response is not treated as success. A REST fallback is documented for when the MCP server is unavailable.

### Added: Spec-driven development handoff
README section on what pm-cockpit shares with a `/spec` workflow, how it differs, and how a story hands off to `/spec`.

### Removed
The archived first-generation skill, and the product-specific context section in `feature-to-user-stories`.

# CHANGELOG

Meaningful changes to the skill system, and why.

---

## v1.1.0 — 2026-10-12

### Changed: `pm-cockpit` split into a lean SKILL.md plus reference files
`SKILL.md` went from 477 to about 180 lines. It keeps what every run needs: configuration, source order, routing summary, pre-flight steps, clarification and the interview gate, duplication check, safety rules and the closing summary. Detail loads only when a request needs it, from `references/`: `routing.md`, `prd.md`, `features.md`, `stories.md`, `audit.md` and `jira-rest.md`. No rules were removed.

---

## v1.0.1 — 2026-10-12

### Fixed: main skill never auto-triggered
The `pm-cockpit` description contained `": "`, which is invalid in an unquoted YAML value. Claude Code still registered the slash command but dropped the description, so the skill never triggered on its own. `claude plugin validate` doesn't catch this.

---

## v1.0.0 — 2026-10-12

First tagged release.

### Added: Plugin packaging
`.claude-plugin/plugin.json` and `marketplace.json`, so the skills install with `/plugin marketplace add brucelanlin/PM-Cockpit`.

### Added: Examples
Sample feature spec, story and sprint brief for the fictional Northwind product in `examples/`.

### Added: Jira tool mapping and feature template in `project-context.md`
The skills name generic Jira operations; each team maps them to its MCP server's tools. The feature section template moved out of the skill into config (§5), so teams can use their own.

### Changed: PRD, local registry, decision log and code repos are optional
Skills skip the steps that need a source the config leaves out. Live Jira is the only hard requirement. Jira Cloud (Markdown/ADF, `/rest/api/3`) is the example default.

### Removed
Non-standard `type:` field from skill frontmatter.

---

## 2026-10-07 — Generic rewrite

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

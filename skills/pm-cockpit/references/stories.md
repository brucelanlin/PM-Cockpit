# Stories and acceptance criteria

`{{PLACEHOLDER}}` values come from `project-context.md`. Loaded on demand by the `pm-cockpit` skill.

## Story splitting strategy

Prefer vertical slices (end-to-end capability) over horizontal splits (frontend-only, backend-only).

- **Workflow step / thin end-to-end slice** — each slice covers the whole workflow at increasing sophistication.
- **Operations (CRUD)** — "manage" or "handle" usually hides several stories.
- **Persona** — different experiences for different personas.
- **Data state** — empty, populated, error.
- **Data variation** — different input types handled by the same capability.
- **Simple / complex** — the simplest valuable version first.
- **Integration boundary** — core capability first, external integration second.
- **Defer performance** — make it work, then make it fast, unless speed blocks the functional story.
- **Risk-first** — validate the uncertain part early.
- **Technical enabler + user-facing** — separate foundational work from the visible feature.
- **Spike (last resort)** — time-boxed investigation that produces learning, then split again.

A story that touches only one technical layer rarely delivers standalone value.

**Post-split check:** does the split reveal work you can defer or cut? Good splits surface the 80/20.

### Sizing

| Size | Points | Duration | When |
|---|---|---|---|
| S | 2 | < 1 day | Simple UI, single storage operation, config change |
| M | 3 | 1–2 days | One component with integration |
| L | 5 | 3–5 days | Multi-component, cross-layer, external integration |
| XL | 8 | ≤ 2 weeks | Only if it can't be split further |

Heuristics: the first instance of a repeated pattern is usually M, later ones S (template reuse). Tightly coupled pieces merged into one story are usually one M.

---

## Story structure

Stories go in `{{STORY_PROJECT}}` with issue type `{{STORY_ISSUE_TYPE_ID}}` and must appear on board `{{BOARD_ID}}`.

**Parent link:** use the method recorded in `{{PARENT_LINK}}`. If it's an issue link rather than the `parent` field, create it after the story exists, then GET the feature and confirm the direction (the feature should show it is the parent). If it's reversed, delete and recreate it.

**Default story format: short.** Only add sections that carry real information.

```
As a <named persona>,
I want <concrete capability>,
so that <motivation>.

*Background*
<1–2 sentences: what exists today and what's missing.>

*In Scope*
* <2–4 bullets>

*Out of Scope*
* <1–3 bullets>

*Estimated Size*
S/2 or M/3 or L/5
```

Plus 4–5 AC items in `{{AC_FIELD}}`. Priority, labels and parent are fields, not description text.

Optional sections: `*Dependencies*` (a hard blocker) and `*Assumptions*` (a decision the developer would otherwise have to guess).

Keep out of the Jira story:
- Open questions. Raise them with the PO in chat; the PO resolves them or takes them to refinement.
- Who or what triggered the story (reviews, emails, coordinators). Describe the product gap, not where the request came from.
- INVEST tables, review notes and size rationale. These stay in chat.

### Priority levels

Use the P0–P3 mapping in `project-context.md` §3.

### Story rules

- No story points at creation; the team estimates.
- Leave unassigned.
- Never use "user" as the persona.
- Make reasonable assumptions; raise open questions in chat, not in the story.
- **"So that" check:** explain motivation, don't restate the action. "So that I can save my work" restates. "So that I don't lose progress if the connection drops" motivates.
- **INVEST gate before generating a story set:** Independent, Negotiable, Valuable, Estimable, Small, Testable. If a story fails Valuable, combine it with other work instead of splitting it.

---

## Acceptance criteria

**AC go in `{{AC_FIELD}}` only, in `{{AC_FIELD_FORMAT}}`. Never put AC in the description** (unless `{{AC_FIELD}}` is `description`).

Every AC item must be:
- **Independently testable** — verifiable without running other AC items first.
- **Observable** — a visible result (UI state, API response, stored value, error message), not an internal detail.
- **Given/When/Then** — no "works correctly" or "is displayed properly".

Bad: `"The schedule is saved"`.
Good: `"Given a dispatcher assigns a job to a technician, When they press Save, Then the job shows the technician and time slot on the board"`.

AC must also cover the relevant unhappy paths: empty or invalid input, dependency failure, missing permission, limits. Anything deliberately skipped goes under Out of Scope.

API notes:
- Checklist-type fields usually reject plain strings; pass the array format.
- Send AC as its own field alongside `description` in the same create/update call.
- After writing, GET the issue and confirm `{{AC_FIELD}}` is non-empty.

---

## Story refinement workflow

1. **Fetch** the story with `summary, description, {{AC_FIELD}}, status, priority, labels` and its parent link.
2. **Analyse**
   - Preflight: confirm it's the issue the PO meant (summary and parent match). If not, stop and ask. Never write to an unconfirmed target.
   - Persona named? Description follows the short format? Technical decisions, symbol names, file paths to remove?
   - "So that" explains motivation?
   - AC: Given/When/Then, observable, edge cases covered, no obsolete items?
   - Run the INVEST table in `references/audit.md`.
3. **Propose** a concise summary of changes and any decisions the PO must make. Get confirmation.
4. **Apply** description and AC in one update. Don't change summary, priority, labels or status unless asked.
5. **Report** the INVEST result with the confirmation.

---

## Final output structure (story sets)

1. **Feature interpretation** — objective, personas, key workflows, constraints
2. **Recommended breakdown** — splitting strategy and stories at a high level
3. **Detailed stories** — full format
4. **Suggested sequencing** — order with dependency reasoning
5. **Cross-story considerations** — shared components, enablers, non-functional needs
6. **Open questions for the PO** — prioritised by impact
7. **Summary table**

| Story | Summary | Priority | Size | Dependencies |
|---|---|---|---|---|
| 1 | … | P0 | M/3 | None |

---

## Content rules

### Descriptions

- **Keep:** persona line, background, in scope, out of scope, size; dependencies and assumptions only when they carry information.
- **Remove:** open questions, who triggered the story, technical decisions, implementation checklists, architect/developer notes, line numbers, file paths, function, type and state-management names.
- **Plain English:** "the app restores the last saved draft" not "restoreDraft() reads from draftStore".
- **Illustrative notes** are fine when labelled: "One approach: …", "e.g. …", "for the architect to decide".
- **Out of Scope** is always explicit.

| Content | Description | AC field |
|---|---|---|
| As a / I want / so that | ✅ | ❌ |
| Background, scope, dependencies | ✅ | ❌ |
| Open design questions | ❌ (chat only) | ❌ |
| Given/When/Then conditions | ❌ | ✅ |
| Line numbers, symbol names | ❌ | ❌ |

### Personas

Always a persona named in `project-context.md`. Never "a user", "the platform", "a developer" or "the system".

### Tone

- Avoid: "enhanced", "leveraging", "seamlessly", em dashes, rule-of-three lists, generic positive conclusions.
- Prefer specific system behaviour over vague outcomes. Vary sentence length.
- Jira content: precision over prose.

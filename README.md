# pm-cockpit

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   ██████╗ ███╗   ███╗     ██████╗ ██████╗  ██████╗██╗  ██╗██╗████████╗
║   ██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██║╚══██╔══╝
║   ██████╔╝██╔████╔██║    ██║     ██║   ██║██║     █████╔╝ ██║   ██║
║   ██╔═══╝ ██║╚██╔╝██║    ██║     ██║   ██║██║     ██╔═██╗ ██║   ██║
║   ██║     ██║ ╚═╝ ██║    ╚██████╗╚██████╔╝╚██████╗██║  ██╗██║   ██║
║   ╚═╝     ╚═╝     ╚═╝     ╚═════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝
║                                                                    ║
║   Claude Code skills for product owners working in Jira            ║
║   Single entry point · 27 routes · Jira-native · Context-aware     ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

A set of Claude Code skills for product owners and product managers who keep their backlog in Jira.

One skill, `pm-cockpit`, is the single entry point for PM work. It works out what kind of request it has, loads your product context, and either does the work itself (features, stories, PRD updates) or hands it to a specialised PM skill with that context already filled in. You never have to remember which skill to call.

Everything specific to your product and Jira setup lives in one file, `project-context.md`. The skills themselves contain no project details.

---

## What you can get done

**Backlog work in Jira**
- Create or refine a feature as a structured spec (your own section template)
- Write or refine stories with Given/When/Then acceptance criteria
- Reflect a scope change (from a pasted email or chat) in a feature and cascade it to its stories
- Review process flows across features for gaps and contradictions
- Keep the PRD in sync with what Jira actually contains

**Planning**
- Sprint planning brief: readiness, coverage gaps, dependencies, sprint goal draft
- PI planning: stories mapped to sprints, features without stories surfaced

**Framing, discovery and strategy** (delegated, with your context pre-loaded)
- Problem framing, opportunity-solution trees, hypotheses, JTBD
- Interview planning, feedback mining, persona refinement, validation probes
- Competitive snapshots, deep analysis, battle cards, market landscape, positioning
- Stakeholder identification and mapping, request decoding
- Story mapping and story splitting

---

## What's in this repo

| Path | What it is |
|---|---|
| `project-context.md` | **The one file you edit.** Product, personas, workflow, file paths, repos, Jira keys and field IDs, Jira tool mapping, feature template, delegation context blocks. Ships with a fictional example. |
| `skills/pm-cockpit/` | Primary skill and single entry point. `SKILL.md` holds the core rules; `references/` holds routing, PRD, feature, story, audit and REST detail, loaded only when needed |
| `skills/sprint-planning/` | Sprint and PI planning from live board state |
| `skills/feature-to-user-stories/` | Lightweight story decomposition; needs no configuration |
| `workflows/ac-field-audit.js` | Workflow that audits every story for AC in the right field |
| `examples/` | Sample output for the fictional product: a [feature spec](examples/feature-spec.md), a [story](examples/story.md) and a [sprint brief](examples/sprint-brief.md) |
| `.claude-plugin/` | Plugin and marketplace manifests, so it installs with `/plugin` |
| `CHANGELOG.md` | Changes and the reasons behind them |

---

## How it works

```
Your request
    │
    ▼
pm-cockpit                 ← single entry point
    │  reads project-context.md, the PRD, live Jira and your code first
    │
    ├── Feature / story / PRD work  → does it directly through your Jira MCP server
    ├── Sprint / PI planning        → sprint-planning
    └── Everything else             → a PM skill, with a context block prepended
                                      (research, competitive, JTBD, OST, splitting…)
```

**Context injection.** When pm-cockpit delegates, it prepends one of the context blocks from `project-context.md`. The delegated skill skips its generic onboarding questions and works with your product from the start.

**Built-in rules**
- Claims resolve in a fixed order: PO decision → live Jira → PRD → registry, research and code. Disagreements are surfaced, not silently resolved.
- PRD authority depends on freshness. It wins on scope if updated in the last 4 weeks; after 8 weeks, live Jira decides what exists and the skill proposes a reconciliation.
- The feature registry is synced from Jira and the code repos are pulled before drafting.
- New or vague features get a one-question-per-turn interview and a confirmation gate before anything is drafted.
- Stories are searched for overlap by text, not only at feature level.
- AC go in a dedicated field, in Given/When/Then, and must cover edge cases.
- Read-only by default. One confirmation before the first Jira write; every write is verified with a re-read.
- Scope decisions and PRD reconciliations go into an append-only decision log, so the reasons survive.

---

## How this fits spec-driven development

Spec-driven development with Claude Code runs **spec → plan → implement → review**, with a human gate at each step. A `/spec` skill interviews the PO one question at a time and writes a non-technical spec into the code repo; developers then plan from it in plan mode and implement from the plan.

pm-cockpit sits one step upstream. It produces the Jira features and stories a `/spec` session can take as its input.

**Same principles**
- No drafting from a one-line prompt. New or vague features get an interview and an explicit confirmation before anything is written.
- Read before asking: the PRD, Jira and code are checked first, so the interview only covers real gaps.
- Jira is input, not truth. Ticket content is challenged, not copied.
- Out of scope, edge cases and testable acceptance criteria are required.
- The PO owns the "what and why".

**Differences**

| | pm-cockpit | `/spec` |
|---|---|---|
| Output | Jira feature (your section template) + stories with Given/When/Then AC | A spec file on a feature branch |
| Granularity | Feature = 1–2 sprints; one story ≈ one spec | One spec per feature branch |
| Grounding | PRD with a freshness check, live Jira, all product repos | Codebase, earlier specs, architecture decision records |
| Traceability | Append-only decision log; PRD reconciliation | Spec and ADR cross-links in the repo |
| Quality gate | INVEST + edge-case audit after every Jira write | Human review against the spec's AC |

**Handoff:** a story created here is the Jira reference you give `/spec`. If your AC live in a custom checklist field, make sure your `/spec` skill fetches that field, or it will miss them.

---

## Setup

### 1. Install

**As a plugin (recommended).** In Claude Code:

```bash
/plugin marketplace add brucelanlin/PM-Cockpit
/plugin install pm-cockpit@pm-cockpit
```

The skills are then available in every project and update with `/plugin marketplace update pm-cockpit`. As a plugin, they're namespaced: `pm-cockpit:pm-cockpit`, `pm-cockpit:sprint-planning`, `pm-cockpit:feature-to-user-stories`. They still trigger on backlog language without you typing the name.

Then put your configuration in the project you work from. Copy [`project-context.md`](project-context.md) to `.claude/project-context.md` there.

**By copying files.** Clone the repo and copy `skills/` and `project-context.md` into the `.claude/` folder of your working directory.

Either way, your workspace ends up like this. Only `project-context.md` is required; the rest is optional.

```
your-workspace/
  .claude/
    project-context.md
  prd.md                  (optional)
  features/               (optional local registry)
  decisions-log.md        (optional, created on first use)
```

**The AC audit workflow** needs Claude Code's Workflow feature, which isn't available in every setup. The plugin installs it as `pm-cockpit:ac-field-audit`; with the copy install, put `workflows/ac-field-audit.js` in `.claude/workflows/`. Run it with `{ project, acField, jiraMcp }` from `project-context.md`. Without the Workflow feature, ask pm-cockpit directly: "audit every story in NFS for AC in the description instead of the AC field".

### 2. Fill in `project-context.md`

Replace the fictional Northwind example with your own values:

1. **Product** — name, audience, phase, principles, workflow steps and module labels, personas, deferred items, competitors, stakeholders.
2. **Files and repos** — project root, PRD path, features folder, decision log, and the code repos to read before drafting stories (or remove that table).
3. **Jira** — base URL, MCP server name, feature and story projects, issue type IDs, board ID, AC field and its format, how stories link to features, required fields for a feature, labels, priority mapping, description markup, and the **tool mapping** from the skills' generic operation names to your MCP server's tools.
4. **Context blocks A–E** — short summaries the delegated skills receive.
5. **Feature template** — the sections every feature uses. Keep the enterprise default or replace it with your own.

Without a PRD, local registry or code repos, the skills skip the steps that need them. Live Jira is the only hard requirement.

To find field and issue type IDs, ask Claude to read an existing issue's full field list through your Jira MCP server, or use `GET /rest/api/2/field` and `GET /rest/api/2/issue/createmeta`.

If you use a PRD, give it a status line the skill can date-check: `**Document Status:** V1.0 (Updated YYYY-MM-DD)`.

### 3. Dependencies

- [Claude Code](https://claude.ai/code)
- A Jira MCP server that can search by JQL, read, create and update issues, and create issue links. Board and sprint tools are used if present. Map the names in `project-context.md` §3
- Optional, for delegated routes: the PM skills marketplace

```bash
/plugin marketplace add deanpeters/Product-Manager-Skills
```

Without it, pm-cockpit does that work itself with the same context.

### 4. Use it

Just describe what you need. "Create a feature for offline job notes", "refine KEY-123", "prepare sprint planning", "how do we compare to X". pm-cockpit triggers on backlog language.

See [`examples/`](examples/) for what the output looks like.

---

## Skills

### `pm-cockpit` — primary skill

The single entry point. Executes feature, story, story refinement, scope-change, cascade, process-flow and PRD work directly; routes planning to `sprint-planning` and framing, research, competitive and stakeholder work to PM skills.

The full routing table (27 routes) is in `skills/pm-cockpit/references/routing.md`.

### `sprint-planning`

Reads the live board and produces a planning brief: readiness flags (missing AC, no parent, no priority, no size, deferred, parent closed), workflow coverage gaps, dependency flags and a "We deliver X so that [persona] can Y" sprint goal. PI mode maps stories to future sprints and surfaces features with no stories.

### `feature-to-user-stories`

Turns a feature description, Jira key, PRD section or epic into INVEST stories with Given/When/Then AC, sizing, dependencies, open questions and a summary table. Works without `project-context.md`; use it for quick decomposition.

### `ac-field-audit` workflow

Pages through every story in a project and reports which have AC in the description instead of the AC field, and which have no AC at all. Read-only.

---

## Story content rules

- Persona line first, no "User Story" header. Persona is always a named persona, never "a user".
- Short by default: background (1–2 sentences), in scope (2–4 bullets), out of scope (1–3), size. Dependencies and assumptions only when they carry information.
- No technical decisions, file paths, symbol names or line numbers in descriptions. Plain English.
- Open questions are raised with the PO in chat, not written into the story.
- "So that" explains motivation; it doesn't restate the action.

---

## Keeping your copy in sync

Your `project-context.md` holds project-specific values, IDs and paths. If you fork this repo, keep it out of public commits (add it to `.gitignore`) or keep your filled-in copy only in your workspace's `.claude/` folder. `settings.local.json`, cookies and credentials are already ignored.

---

## License

Apache 2.0. See [LICENSE](LICENSE).

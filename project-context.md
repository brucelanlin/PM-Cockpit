# Project context

This is the only file you need to edit to use pm-cockpit on your product. Every skill reads it at session start, and every `{{PLACEHOLDER}}` in the skills refers to a value defined here.

Copy it to `.claude/project-context.md` in your working folder and replace the example values. The example below describes a fictional product, **Northwind Field Service**, so you can see what a filled-in file looks like.

Rules for the skills: treat these values as last-known configuration. Before the first Jira write of a session, verify IDs against live Jira metadata. If a value has changed, use the live value and tell the PO. Never invent a value that is missing here; ask instead.

---

## 1. Product

| Key | Value |
|---|---|
| `PRODUCT_NAME` | Northwind Field Service |
| `PRODUCT_ONE_LINER` | A mobile and web app that schedules, dispatches and records on-site repair jobs for field technicians |
| `AUDIENCE` | Internal operations teams and contracted technicians (B2B) |
| `CURRENT_PHASE` | MVP |
| `PHASES` | PoC, MVP, Scale |
| `PRINCIPLES` | Offline first; one source of truth for job status; no free-text where a pick list will do |

### Workflow / modules

The workflow is the backbone for story splitting and story mapping. Each module has a Jira label.

| Step | Module | Label | What happens |
|---|---|---|---|
| 1 | Job Intake | `job-intake` | Dispatcher creates a job from a customer request |
| 2 | Scheduling | `scheduling` | Job is assigned to a technician and time slot |
| 3 | On-site Work | `on-site` | Technician records work, parts and photos |
| 4 | Close-out | `close-out` | Customer signs off; job is invoiced |
| — | Cross-cutting | `governance` | Permissions, audit, data retention |

### Personas

Use these names in every story. Never "a user", "the system" or "the platform".

| Persona | Roles | Status |
|---|---|---|
| Dispatcher | Operations coordinators, schedulers | Primary (MVP) |
| Field Technician | In-house and contracted technicians | Primary (MVP) |
| Service Manager | Regional managers, reporting | Later (Scale) |
| Platform Administrator | Configures catalogues and access | Later, always marked "(KIV)" |

### Deferred / out of bounds

| Item | Reason |
|---|---|
| `NFS-41` Route optimisation | Formally deferred to Scale; do not create stories for it |

### Competitive / adjacent tools

Alternatives to frame against: spreadsheets plus phone dispatch, generic ticketing tools, commercial field-service suites.
Decision this supports: roadmap prioritisation and positioning against those alternatives.

### Stakeholders

Sponsors (operations leadership), engineering lead, design lead, compliance/data-protection owner, end users (dispatchers and technicians), platform administrators (KIV).

---

## 2. Files and repos

Everything in this section is **optional**. Leave a row out (or delete the repos table) and the skills skip the steps that use it.

| Key | Value |
|---|---|
| `PROJECT_ROOT` | `/Users/you/projects/northwind` (Windows: `C:\Users\you\projects\northwind`) |
| `PRD_PATH` | `{{PROJECT_ROOT}}/prd.md` — optional; without it, live Jira and the PO's decisions are the only scope authority |
| `FEATURES_DIR` | `{{PROJECT_ROOT}}/features/` (contains `SYNC-STATUS.md`) — optional local registry |
| `DECISION_LOG` | `{{PROJECT_ROOT}}/decisions-log.md` — optional |

The PRD should carry a status line the skills can date-check: `**Document Status:** Vx.x (Updated YYYY-MM-DD)`, plus a `## Changelog` table.

### Code repos

The skills pull these before drafting stories, so names and behaviour in stories match the code. Remove this table if your PM work doesn't touch code.

| Repo | Location | Integration branch | Read first |
|---|---|---|---|
| `northwind-app` | `{{PROJECT_ROOT}}/northwind-app` (local clone) | `develop` | `src/models/`, `src/screens/` |
| `northwind-api` | `org/northwind-api` on your Git host (remote, read with `gh api`) | `develop` | `app/services/`, `pyproject.toml` |

---

## 3. Jira

| Key | Value | Notes |
|---|---|---|
| `JIRA_BASE_URL` | `https://yourcompany.atlassian.net` | |
| `JIRA_MCP` | `jira` | Name of your Jira MCP server. It must expose `search_issues`, `get_issue`, `create_issue`, `update_issue`, `get_board_issues` (or equivalents) |
| `JIRA_AUTH_NOTE` | API token in the MCP server config | Keep cookies/tokens outside the project folder, especially if it syncs to cloud storage |
| `FEATURE_PROJECT` | `NFS` | Where Features live |
| `FEATURE_ISSUE_TYPE_ID` | `10000` | |
| `FEATURE_JQL` | `project = NFS AND issuetype = Feature ORDER BY created ASC` | Defines "all features for this product" |
| `STORY_PROJECT` | `NFS` | Can be the same project as features or a separate team project |
| `STORY_ISSUE_TYPE_ID` | `10001` | |
| `BOARD_ID` | `42` | Scrum board where every story must appear |
| `AC_FIELD` | `customfield_10100` | Field that holds acceptance criteria. Use `description` if your project has no dedicated field |
| `AC_FIELD_FORMAT` | Checklist array: `[{"checked": false, "name": "Given …, When …, Then …"}]` | Or plain text if it's a text field |
| `PARENT_LINK` | `parent` field: `{"key": "NFS-12"}` | Some setups use an issue link instead, e.g. type `Parent-Child` with the feature as `inwardIssue`. Record which here |
| `RELATED_LINK` | `Relates` | Link type for overlapping stories |
| `FORBIDDEN_FIELDS` | none | Fields that make create calls fail on this project, if any |

### Jira tool mapping

The skills name generic operations. Map each one to the tool your Jira MCP server actually exposes (run `/mcp` or ask Claude to list the server's tools). If a server has no board tools, the skills fall back to JQL (`sprint in openSprints()`, `sprint in futureSprints()`).

| Operation in the skills | Your tool |
|---|---|
| `search_issues` (JQL search) | `search_issues` |
| `get_issue` | `get_issue` |
| `create_issue` | `create_issue` |
| `update_issue` | `update_issue` |
| `create_issue_link` | `create_issue_link` |
| `get_board_issues` | `get_board_issues` |
| `get_board_active_sprint` | `get_board_active_sprint` |
| `get_board_sprints` | `get_board_sprints` |

Example for Atlassian's remote MCP server on Jira Cloud: `search_issues` → `searchJiraIssuesUsingJql`, `get_issue` → `getJiraIssue`, `create_issue` → `createJiraIssue`, `update_issue` → `editJiraIssue`. Check the names against your server; they change between versions.

### Required fields when creating a Feature

```json
{
  "project": { "key": "NFS" },
  "issuetype": { "id": "10000" },
  "summary": "Feature title",
  "description": "…",
  "priority": { "id": "2" },
  "components": [{ "id": "10200" }],
  "labels": ["northwind", "<module-label>", "<phase-label>"]
}
```

### Labels

- Always: `northwind`
- Module: one of the module labels above
- Phase: `poc`, `mvp`, `scale`

### Priority mapping

| Level | Meaning | Jira priority (id) |
|---|---|---|
| P0 | Blocks the current phase; critical path | Highest (`1`) |
| P1 | Core user journey; not blocking | High (`2`) |
| P2 | Quality, analytics, advanced scenarios | Medium (`3`) |
| P3 | Later phase, extensibility, scale | Low (`4`) |

### Description markup

`DESCRIPTION_MARKUP`: `wiki` (Jira Server/Data Center wiki markup) or `adf` / `markdown` (Jira Cloud, depending on your MCP server). The skills convert headings and lists to this format.

Value for this project: `markdown` (Jira Cloud via an MCP server that converts Markdown to ADF).

On Jira Cloud, authenticate with an API token or OAuth through the MCP server, and use `/rest/api/3` for any REST fallback.

---

## 4. Context blocks for delegation

pm-cockpit prepends these blocks when it hands work to a generic PM skill, so that skill can skip its onboarding questions. Keep them short and factual.

**Block A — Product and personas** (research, discovery, JTBD, personas, hypotheses)
```
Product: Northwind Field Service — schedules, dispatches and records on-site repair jobs.
Workflow: Job Intake → Scheduling → On-site Work → Close-out.
Personas: Dispatcher (primary, MVP); Field Technician (primary, MVP); Service Manager (Scale); Platform Administrator (KIV).
Principles: offline first; one source of truth for job status; no free text where a pick list will do.
```

**Block B — Scope and structure** (story splitting, story mapping)
```
Audience: internal operations teams and contracted technicians. Phase: MVP, Dispatcher and Technician first.
Use the workflow steps as the splitting backbone. Module labels: job-intake, scheduling, on-site, close-out, governance.
Deferred: NFS-41 Route optimisation. Features and stories live in Jira project NFS, board 42.
```

**Block C — Competitive framing** (competitive and market work)
```
Alternatives: spreadsheets plus phone dispatch, generic ticketing tools, commercial field-service suites.
Decision supported: roadmap prioritisation and positioning. Feed findings back into the PRD; flag conflicts instead of overriding it.
```

**Block D — Request decoding** (incoming stakeholder asks)
```
I am the Product Owner of Northwind Field Service (MVP phase). Stakeholders: operations sponsors, engineering lead, design lead, compliance owner, dispatchers and technicians.
Separate the literal ask from the job to be done, name the affected persona, and flag conflicts with PRD scope or the deferred list.
```

**Block E — Stakeholder mapping**
```
Product Owner of Northwind Field Service, MVP phase. Stakeholder types: operations sponsors (fund adoption), engineering lead (delivery), design lead (UX), compliance owner (data retention, audit), dispatchers and technicians (end users), platform administrators (KIV).
Identify who can block, who can accelerate, and whose voice is missing.
```

---

## 5. Feature template

The sections every feature description uses, in order. Replace this list with your team's own template; pm-cockpit won't add, skip or merge sections.

The default below is an enterprise-grade template. A lighter team might keep only 1, 2, 4, 7 and 9.

| # | Section | Notes |
|---|---|---|
| 1 | Current Situation / Problem Statement / Objectives | Problem → impact → measurable objective |
| 2 | Boundaries / Assumptions / Out of Scope | |
| 3 | Personas | One line each, named personas only |
| 4 | User Stories | 4–9 high-level "As a / I want / so that" |
| 5 | Process Flow | Numbered system flow; "NA" if there is none |
| 6 | Reliability, Availability & Serviceability / Consistency / Traceability & Transparency / Data Protection | Sub-heading per dimension |
| 7 | Business Acceptance — Definition of Done | Demoable checks |
| 8 | Solution Capabilities — In Scope | |
| 9 | Architecture Concept / Integration Scenarios / Dependencies | Name dependent features by key |

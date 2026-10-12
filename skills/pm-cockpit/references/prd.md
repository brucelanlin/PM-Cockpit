# PRD freshness, reconciliation and decision log

`{{PLACEHOLDER}}` values come from `project-context.md`. Loaded on demand by the `pm-cockpit` skill.

## PRD precedence is conditional on freshness
A static "PRD always wins" rule rots because the PRD drifts from the backlog. Precedence depends on how recently the PRD was reconciled against live Jira.

Read the PRD's `**Document Status:** Vx.x (Updated YYYY-MM-DD)` line at session start and classify against today:

| Age since `Updated` | State | Effect on precedence |
|---|---|---|
| ≤ 4 weeks | **fresh** | PRD wins on scope and principles. |
| 4–8 weeks | **review-due** | PRD still wins, but tell the PO once that it is due for reconciliation. Proceed. |
| > 8 weeks | **stale** | Live Jira is the tiebreaker on what exists and its status; the PRD still owns intent and principles. Before relying on a PRD scope claim, run reconciliation and flag the drift. |

If the PRD has no status line, treat it as review-due and suggest adding one.

---

## PRD reconciliation loop
Reconciliation is how live Jira flows back into the PRD. Run it when the PRD is stale, when a scope-change message arrives, or when the PO asks.

1. Diff PRD scope against the live feature set pulled during registry sync.
2. State each drift as a **proposal**, by PRD section and Jira key: *"PRD says X; Jira shows Y (KEY-NNN, status Z). Propose updating section N to …"*. Never auto-resolve a scope conflict.
3. On the PO's approval: update only that section, bump the version and `Updated` date, add a changelog row, and append a Decision-log entry. Freshness resets.

If the PO declines to reconcile now, continue using live Jira as the tiebreaker and leave the drift flagged.

---

## PRD refinement workflow

1. Read `{{PRD_PATH}}`.
2. Run `{{FEATURE_JQL}}` and compare what exists in Jira with what the PRD says.
3. Ask which section needs updating if it isn't clear.
4. Propose a before/after. Flag conflicts with existing features or decisions. Don't expand scope beyond Jira unless the PO directs it.
5. On confirmation: update only that section, keep the structure, bump the version and `Updated` date, add a changelog row, append a Decision-log entry, and summarise the change in one line.

---

## Decision log

An append-only record of product decisions and PRD reconciliations at `{{DECISION_LOG}}`, so the reason behind scope changes survives across sessions. Create it on first use.

Append (never edit in place; corrections are new rows) when:
- a confirmed scope decision from a message is applied to Jira
- a PRD reconciliation is approved
- the PO makes a scope call that changes what is in or out of the backlog

```markdown
| Date | Decision | Affected (keys / PRD section) | Source | Applied by |
|------|----------|-------------------------------|--------|------------|
| 2026-10-02 | Defer route optimisation to Scale | NFS-41, PRD §6 | Email from sponsor, 2026-10-01 | pm-cockpit |
```

`SYNC-STATUS.md` is the current-state index and is rewritten each sync; the decision log is history and is never overwritten. Use it to answer "why did we change X?", not "what is X's status?" (live Jira answers that).

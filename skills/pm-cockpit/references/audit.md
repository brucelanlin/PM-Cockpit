# Post-creation audit

`{{PLACEHOLDER}}` values come from `project-context.md`. Loaded on demand by the `pm-cockpit` skill.

## Post-creation audit

After creating or updating any feature or story:

1. **Jira verification** — GET the issue; confirm fields, labels, components, AC and the parent link (including direction).
2. **Registry sync** (if `{{FEATURES_DIR}}` is set) — after any feature creation or status change, re-run `{{FEATURE_JQL}}` and update `SYNC-STATUS.md`.
3. **Board** — confirm the issue appears on board `{{BOARD_ID}}` and is linked to the right feature, and that the feature is still open.
4. **Local files** (if `{{FEATURES_DIR}}` is set) — new feature: add `<number>-<kebab-title>.md` to `{{FEATURES_DIR}}`; new story: note it in the feature file.
5. **INVEST + edge-case check** on every story created or updated:

| Criterion | Check | On failure |
|---|---|---|
| Independent | Can it be prioritised without a hard dependency on another in-flight story? | Document the dependency; flag if it blocks sprint entry |
| Negotiable | Does it leave implementation to the developer? | Remove prescriptive detail; use "one approach:" framing |
| Valuable | Observable value to a named persona? | Reframe; if no user value, combine with another story |
| Estimable | Can the team size it? | Raise blockers with the PO; don't force an estimate |
| Small | Fits in a sprint, one capability? | Split using the strategy in `references/stories.md` |
| Testable | Every AC Given/When/Then with an observable outcome? | Rewrite failing AC |
| Edge cases | AC covers empty/invalid input, dependency failure, permissions, limits? | Add AC, or list deliberately deferred cases under Out of Scope |

6. **Code cross-reference** — if the code already implements part of it, comment on the issue with the starting point.
7. **Handoff** — if the team uses spec-driven development, tell the PO the story key is ready to hand to their `/spec` session as the Jira reference.

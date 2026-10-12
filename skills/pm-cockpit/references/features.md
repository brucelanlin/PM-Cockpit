# Feature specs

`{{PLACEHOLDER}}` values come from `project-context.md`. Loaded on demand by the `pm-cockpit` skill.

## Feature spec structure

Every feature description uses the sections in the **Feature template** in `project-context.md` §5, in that order. Don't add, skip or merge sections. If §5 is missing, ask the PO for their template before drafting.

Format headings for `{{DESCRIPTION_MARKUP}}`. For Jira wiki markup: `h2.` for sections, `h3.` for sub-headings, `*bold*`, `*` bullets, `#` numbered lists, `{code}` blocks.

### Writing standards for features

- Problem → impact → objective must connect. If the problem doesn't explain why it matters to the personas, rewrite it.
- Objectives are specific and measurable: "reduce time to first scheduled job" beats "improve the experience".
- Personas: one line each, named personas only.
- The user-stories section holds 4–9 high-level "As a / I want / so that" stories. Implementation stories go in `{{STORY_PROJECT}}`.
- The dependencies section names dependent features by key ("Depends on KEY-123").

---

## Creating a Feature

Use the required-fields template from `project-context.md` §3. Before the first create or update of a session, verify project, issue type, components, custom fields and `{{AC_FIELD}}` against live Jira metadata. Never send a field listed in `{{FORBIDDEN_FIELDS}}`. Labels: product label + one module label + one phase label.

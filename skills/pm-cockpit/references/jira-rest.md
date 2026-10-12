# Jira REST fallback

`{{PLACEHOLDER}}` values come from `project-context.md`. Loaded on demand by the `pm-cockpit` skill.

## When to use

Only when the Jira MCP call fails and the PO has approved the write. Report the draft and the failure first; don't fall back silently.

## Steps

- Authenticate the way your Jira setup requires (API token or session). Test with `GET /rest/api/2/myself`; on 401, ask the PO to re-authenticate.
- Headers: `Content-Type: application/json`, `X-Atlassian-Token: no-check`.
- In Git Bash on Windows, set `MSYS_NO_PATHCONV=1` so `/rest/...` arguments aren't rewritten as paths.
- Build JSON payloads with a script, not hand-escaped strings.
- Order: create issue → parent link → GET issue and feature to verify fields, AC and link direction → confirm board visibility.
- Keep helper scripts and credentials out of the project folder.

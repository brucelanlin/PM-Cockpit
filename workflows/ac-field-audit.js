export const meta = {
  name: 'ac-field-audit',
  description: 'Audit every story in a Jira project: is the acceptance criteria in the AC field, in the description, or missing',
  phases: [
    { title: 'Fetch stories', detail: 'Page through all story keys in the project' },
    { title: 'Audit', detail: 'Check each story for AC in the description and in the AC field' },
    { title: 'Synthesize', detail: 'Produce a fix list' },
  ],
}

// Parameters (pass as the workflow's args). Take the values from project-context.md.
//   project  — story project key, e.g. "NFS"                     (STORY_PROJECT)
//   acField  — field that holds AC, e.g. "customfield_10100"     (AC_FIELD)
//   jiraMcp  — name of your Jira MCP server, e.g. "jira"         (JIRA_MCP)
//   pageSize — keys fetched per page (default 100)
//   maxPages — safety cap on pages (default 20, i.e. 2,000 stories)
const project = args?.project
const acField = args?.acField
const jiraMcp = args?.jiraMcp ?? 'jira'
const pageSize = args?.pageSize ?? 100
const maxPages = args?.maxPages ?? 20

if (!project || !acField) {
  throw new Error('Pass args { project, acField } — see project-context.md (STORY_PROJECT, AC_FIELD).')
}

const ISSUE_SCHEMA = {
  type: 'object',
  properties: {
    key: { type: 'string' },
    summary: { type: 'string' },
    hasACInDescription: { type: 'boolean' },
    hasACInField: { type: 'boolean' },
    acFieldEmpty: { type: 'boolean' },
    descriptionSnippet: { type: 'string' },
    status: { type: 'string' },
  },
  required: ['key', 'summary', 'hasACInDescription', 'hasACInField', 'acFieldEmpty', 'status'],
}

const PAGE_SCHEMA = {
  type: 'object',
  properties: {
    keys: { type: 'array', items: { type: 'string' } },
    total: { type: 'number' },
  },
  required: ['keys'],
}

phase('Fetch stories')

const jql = `project = ${project} AND issuetype = Story ORDER BY key ASC`

// Read the first page to learn the total, then fetch the remaining pages in parallel.
const first = await agent(
  `Use the ${jiraMcp} MCP server to search Jira with JQL: ${jql}
Request startAt 0 and maxResults ${pageSize}, fields: key only.
Return the issue keys in order and the total number of matching issues.`,
  { label: 'fetch-keys:0', phase: 'Fetch stories', schema: PAGE_SCHEMA }
)

const total = first.total ?? first.keys.length
const pages = Math.min(Math.ceil(total / pageSize), maxPages)
if (Math.ceil(total / pageSize) > maxPages) {
  log(`Warning: ${total} stories found; auditing the first ${maxPages * pageSize}. Raise maxPages to cover all.`)
}

const rest = await parallel(
  Array.from({ length: Math.max(pages - 1, 0) }, (_, i) => (i + 1) * pageSize).map(startAt => () =>
    agent(
      `Use the ${jiraMcp} MCP server to search Jira with JQL: ${jql}
Request startAt ${startAt} and maxResults ${pageSize}, fields: key only.
Return the issue keys in order.`,
      { label: `fetch-keys:${startAt}`, phase: 'Fetch stories', schema: PAGE_SCHEMA }
    )
  )
)

const allStoryKeys = [...new Set([first, ...rest].filter(Boolean).flatMap(p => p.keys))]
log(`Found ${allStoryKeys.length} stories to audit`)

phase('Audit')

const results = await pipeline(
  allStoryKeys,
  key => agent(
    `Use the ${jiraMcp} MCP server's get_issue tool to fetch ${key} with fields: summary,status,description,${acField}.

Then analyse:
1. Does the description contain acceptance criteria? Look for "Acceptance Criteria", "AC:", Given/When/Then lines, or a list of testable conditions. Set hasACInDescription accordingly.
2. Is ${acField} populated (non-null and non-empty)? Set hasACInField = true if so; acFieldEmpty = true if null or empty.
3. Record the status.
4. If hasACInDescription is true, include a snippet (max 100 characters) of the AC text found in the description.

This is read-only. Do not modify the issue.`,
    { label: `audit:${key}`, phase: 'Audit', schema: ISSUE_SCHEMA }
  )
)

phase('Synthesize')

const valid = results.filter(Boolean)
const acInDescription = valid.filter(r => r.hasACInDescription)
const noACAnywhere = valid.filter(r => !r.hasACInDescription && r.acFieldEmpty)
const correct = valid.filter(r => !r.hasACInDescription && !r.acFieldEmpty)

log(`Audit complete: ${valid.length} stories checked`)
log(`- AC in description (move to ${acField}): ${acInDescription.length}`)
log(`- No AC anywhere (needs AC): ${noACAnywhere.length}`)
log(`- Correct (AC only in field): ${correct.length}`)

return {
  acInDescription,
  noACAnywhere,
  correct,
  totalChecked: valid.length,
}

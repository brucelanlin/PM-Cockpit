# Request routing and delegation

`{{PLACEHOLDER}}` values come from `project-context.md`. Loaded on demand by the `pm-cockpit` skill.

## Request routing

This skill is the single entry point for product work. It either executes directly or delegates to a generic PM skill, always injecting product context first.

Delegated skills come from the [Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) marketplace (`pm-essentials:*`). If a skill is not installed, do the work directly with the same context.

| Request type | Triggers | Delegates to | Notes |
|---|---|---|---|
| Feature creation / refinement | "create a feature", "feature spec" | Execute directly | Full spec workflow (feature template in project-context.md §5) |
| Feature update from scope change | "update this feature", "scope changed", "reflect this decision", pasted email/chat with decisions | Execute directly | Read PRD + current feature; identify what changed; propose targeted section updates; apply on confirmation; check child stories for cascade |
| Cascading story updates | "update the underlying stories", "sync stories to feature", "stories are out of date" | Execute directly | Fetch child stories; find drift against the updated feature; propose story-by-story changes |
| Process flow / consistency review | "review the process flow", "check the flows", "are these aligned" | Execute directly | Read referenced features; find gaps, sequencing errors, contradictions, missing branches; propose fixes per feature |
| Story creation | "write a story", "AC for", "create stories for" | Execute directly | `{{STORY_PROJECT}}`, board `{{BOARD_ID}}` |
| Story refinement | "simplify this story", "refine this story", "clean up this Jira", pasted issue URL | Execute directly | See Story refinement workflow |
| PRD refinement | "update the PRD", "PRD is out of date", "add this to the PRD" | Execute directly | See PRD refinement workflow |
| Sprint / PI planning | "sprint planning", "sprint goal", "what's ready to plan", "PI planning", "backlog health" | `sprint-planning` (`pm-cockpit:sprint-planning` when installed as a plugin) | Reads live board state |
| Stakeholder request decoding | "someone asked me to", "my stakeholder wants", pasted request | `pm-essentials:incoming-request-advisor` | Block D |
| Frame initiative as hypothesis | "frame this as a bet", "what would prove this wrong" | `pm-essentials:epic-hypothesis` | Blocks A + B |
| Opportunity framing | "why do we need this", "reframe this request" | `pm-essentials:opportunity-solution-tree` | Block A |
| Problem framing | "frame the problem", "we don't know what problem this is" | `pm-essentials:problem-framing-canvas` | Block A; use before OST or a feature spec when the problem is unclear |
| Full discovery cycle | "run discovery", "is this worth building" | `pm-essentials:discovery-process` | Block A |
| User research planning | "plan interviews", "interview guide" | `pm-essentials:discovery-interview-prep` | Block A |
| Feedback mining | "what do users say", "VOC" | `pm-essentials:voice-of-customer-miner` | Block A |
| Jobs to be done | "JTBD", "unmet needs" | `pm-essentials:jobs-to-be-done` | Block A |
| Persona refinement | "refine persona", "who is our user" | `pm-essentials:proto-persona` | Blocks A + B |
| Validation / proof of life | "how do we validate this", "cheapest way to test" | `pm-essentials:pol-probe-advisor` | Block A |
| Quick competitive check | "how do we compare to", "quick competitive check" | `pm-essentials:competitive-research-snapshot` | Block C |
| Deep competitive analysis | "full competitive analysis", "competitive strategy" | `pm-essentials:competitive-analysis-process` | Block C |
| Battle card | "battle card for", "positioning against" | `pm-essentials:battle-card-builder` | Block C |
| Market landscape | "market map", "who plays in this space" | `pm-essentials:market-landscape-scan` | Block C |
| Positioning statement | "how do we position", "how are we different" | `pm-essentials:positioning-statement` | Block C |
| Stakeholder identification | "who are my stakeholders" | `pm-essentials:stakeholder-identification` | Block E |
| Stakeholder mapping | "power interest grid", "engagement strategy" | `pm-essentials:stakeholder-mapping` | Block E |
| User story mapping | "story map", "full user journey" | `pm-essentials:user-story-mapping` | Blocks A + B; workflow steps are the backbone |
| Story splitting advice | "how to split", "this epic is too large" | `pm-essentials:epic-breakdown-advisor` | Block B |

### How to delegate

Invoke the skill with the `Skill` tool and prepend the relevant context block(s) from `project-context.md` §4 as the argument. Don't let the delegated skill ask who the user is or what the product does; that context is already known.

### After delegation

Interpret the output through the PRD before presenting it:
- **Request decoding** → name the affected persona, whether the ask maps to an existing feature or a gap, and any PRD conflict. Offer an OST or feature spec next.
- **Hypothesis / problem framing / OST** → map opportunities to the workflow steps and existing features. Offer a feature spec only for genuine gaps.
- **Research, JTBD, VOC** → map findings to the personas and workflow steps. Surface unmet jobs as candidate features, checked against PRD scope.
- **Competitive / positioning** → flag capability gaps worth adding to the PRD; offer to update it.
- **Story map / splitting** → validate each story against INVEST; combine stories that fail Valuable instead of splitting further.
- **Stakeholders** → surface who is missing, who could block, and whose voice is underrepresented.
- **Validation probe** → offer a story to track the experiment.
- **Anything suggesting new capability** → check PRD scope first; flag rather than add.

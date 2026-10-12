# Example: sprint planning brief

What the `sprint-planning` skill produces from live board state, using the fictional Northwind Field Service configuration.

---

## Sprint Planning Brief — Sprint 14 (20 Oct – 31 Oct)

### Active sprint
Sprint 13, 6 Oct – 17 Oct. 9 stories: 6 done, 2 in review, 1 in progress (NFS-61, carries over).

### Readiness
- Ready to plan: 7 stories
- Needs attention: 3 stories

| Story | Summary | Module | Priority | Flags |
|---|---|---|---|---|
| NFS-66 | Attach photos to a job offline | on-site | P1 | missing-ac |
| NFS-70 | Customer signature on close-out | close-out | P1 | no-estimate |
| NFS-73 | Suggest technicians by skill | scheduling | P2 | deferred (relates to NFS-41) |

### Recommended candidates

| Story | Summary | Module | Priority | Size |
|---|---|---|---|---|
| NFS-64 | Save job notes and parts offline and sync when back online | on-site | P0 | M/3 |
| NFS-65 | Show pending and synced state per record | on-site | P1 | S/2 |
| NFS-58 | Block double bookings for a technician | scheduling | P0 | M/3 |
| NFS-59 | Technician day view on the dispatch board | scheduling | P1 | M/3 |
| NFS-67 | Show last sync time to dispatchers | on-site | P1 | S/2 |
| NFS-71 | Close-out checklist before sign-off | close-out | P2 | S/2 |

### Workflow coverage

| Module | Candidate stories | Notes |
|---|---|---|
| job-intake | 0 | gap — fine this sprint, intake shipped in Sprint 11 |
| scheduling | 3 | |
| on-site | 6 | pile-up — consider deferring NFS-66 until AC are written |
| close-out | 2 | |
| governance | 0 | gap — data retention story for offline records not written yet |

### Dependency flags

| Story | Depends on | Dependency status | Flag |
|---|---|---|---|
| NFS-64 | NFS-18 Job download on open | Done | — |
| NFS-67 | NFS-64 | To Do | blocked until NFS-64 lands; plan both or neither |

### Suggested sprint goal
> We deliver **offline note and parts capture** so that **Field Technicians** can finish on-site records without a signal.

### Open items for the PO
- NFS-66 needs AC before it can come in. Write them now, or defer to Sprint 15?
- No story covers deleting offline data after a job closes, which the feature requires. Create one under governance?
- NFS-61 carries over. Confirm it still fits alongside NFS-64.

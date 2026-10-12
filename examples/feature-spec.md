# Example: feature spec

What pm-cockpit produces for a new feature, using the fictional Northwind Field Service configuration in `project-context.md`. It ran the one-question-per-turn interview and the confirmation gate first; this is the result after the PO confirmed.

Labels: `northwind`, `on-site`, `mvp` · Priority: High · Project: `NFS`

---

## Offline Job Notes for Field Technicians

### 1. Current Situation / Problem Statement / Objectives

**Problem.** Technicians record work notes, parts used and photos in the app, but saving needs a connection. Basements, plant rooms and rural sites often have none. Technicians write on paper and re-enter notes later, and about one job in five closes with missing parts data.

**Impact.** Missing parts data delays invoicing in Close-out and breaks stock reorder for the van.

**Objectives**
- A technician can complete all on-site records with no connection.
- Records sync without user action within 2 minutes of the connection returning.
- Jobs closed with missing parts data fall from about 20% to under 5% within one quarter.

### 2. Boundaries / Assumptions / Out of Scope

**Assumptions**
- The job and its checklist are downloaded when the technician opens it, while still online.
- One technician edits a job's notes at a time.

**Out of scope**
- Creating new jobs offline.
- Offline route or map data (route optimisation is deferred, NFS-41).
- Conflict resolution between two technicians on one job.

### 3. Personas

- **Field Technician** — records work on site, often without signal.
- **Dispatcher** — needs to see when on-site records have arrived.

### 4. User Stories

- As a Field Technician, I want to add notes and parts with no connection, so that I don't re-enter them from paper later.
- As a Field Technician, I want to attach photos offline, so that the evidence is captured while I'm at the equipment.
- As a Field Technician, I want to see which records haven't synced yet, so that I know whether it's safe to leave site.
- As a Dispatcher, I want to see when a job's on-site records last synced, so that I don't chase technicians for updates that are already on their way.

### 5. Process Flow

1. Technician opens a job while online; the app stores the job and checklist on the device.
2. Technician adds notes, parts and photos; each record is saved locally with a timestamp and marked "pending".
3. The app checks for a connection every 30 seconds.
4. When connected, pending records upload oldest first; each is marked "synced" on success.
5. On a failed upload, the record stays "pending" and is retried; after 5 failures the technician sees an error with a retry button.
6. The job shows its last sync time to the Dispatcher.

### 6. Reliability, Availability & Serviceability / Consistency / Traceability & Transparency / Data Protection

**Reliability, Availability & Serviceability**
- Local records survive app restarts and device reboots.
- Upload retries back off and stop after 5 attempts per record; failures are logged with the job ID.

**Consistency**
- Records upload in the order they were created. The server rejects duplicates by record ID.

**Traceability & Transparency**
- Each record keeps its local creation time and its sync time. The technician sees pending/synced state per record.

**Data Protection**
- Local data is encrypted at rest and deleted from the device 7 days after the job closes.

### 7. Business Acceptance — Definition of Done

- The four user stories are demoed on a device in airplane mode.
- A pilot group of 10 technicians uses it for two weeks; missing-parts closures are measured.
- Out-of-scope items above are confirmed not built.
- Release notes and the technician quick guide are updated.

### 8. Solution Capabilities — In Scope

- Offline capture of notes, parts and photos against a downloaded job
- Pending/synced state per record and per job
- Automatic background sync with retry and a manual retry
- Last-sync time visible to Dispatchers

### 9. Architecture Concept / Integration Scenarios / Dependencies

- On-device store for job data and pending records; upload queue processed in creation order.
- Uses the existing job records API; adds an idempotency key per record.
- Depends on NFS-18 (job download on open).

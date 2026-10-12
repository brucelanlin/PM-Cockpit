# Example: story

One story pm-cockpit split from the [Offline Job Notes feature](feature-spec.md), in the default short format. Priority, labels and the parent link are Jira fields, not description text.

Summary: `Save job notes and parts offline and sync when back online`
Parent: NFS-52 · Priority: High · Labels: `northwind`, `on-site`, `mvp`

---

## Description

As a Field Technician,
I want to add notes and parts to a job with no connection,
so that I don't re-enter them from paper after I leave site.

*Background*
Saving notes and parts needs a connection today, so technicians on sites without signal fall back to paper and re-enter it later.

*In Scope*
* Add and edit notes and parts on a downloaded job while offline
* Show each record as pending or synced
* Upload pending records automatically when the connection returns

*Out of Scope*
* Photos (separate story)
* Two technicians editing the same job

*Estimated Size*
M/3

## Acceptance criteria (in the AC field)

- [ ] Given a downloaded job and no connection, When the technician adds a note and presses Save, Then the note appears on the job marked "pending"
- [ ] Given pending records on a job, When the connection returns, Then the records upload within 2 minutes and show "synced"
- [ ] Given a pending record, When the app is closed and reopened offline, Then the record is still on the job and still "pending"
- [ ] Given an upload fails 5 times, When the technician opens the job, Then they see an error on that record and a Retry button
- [ ] Given the technician enters a part quantity of 0 or less, When they press Save, Then the app shows "Quantity must be at least 1" and doesn't save

---

What stayed in chat, not in Jira: the INVEST check (all pass; Independent depends on NFS-18 being done), the size rationale, and one open question for the PO (should a technician be warned before leaving site with pending records?).

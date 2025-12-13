# ADR 001: File Lifecycle & Dataset Cleanup

**Status:** Accepted  
**Date:** 2025-01-XX (Sprint 17)  
**Context:** Need to prevent orphaned files in Dataset table when entities are deleted or updated

## Context

The application stores uploaded files (images, PDFs) in the `Dataset` table as Base64 data URLs. When entities (Events, Members, Settings) are deleted or updated, their associated files should be cleaned up to prevent storage bloat and orphaned records.

## Decision

We will implement a centralized file lifecycle service (`src/modules/files/fileService.ts`) that:

1. **Links files to entities** - Associates Dataset records with entities via `source` and `eventId` fields
2. **Cleans up on delete** - Automatically removes files when entities are deleted
3. **Handles updates** - Replaces old files when entities are updated (e.g., CV change, favicon update)

## Implementation

### Architecture

```
Upload → Dataset.create() → linkFileToEntity() → Entity Delete/Update → unlinkAndDeleteFilesForEntity() → Dataset.delete()
```

### Service Functions

**Core Functions:**
- `linkFileToEntity(datasetId, usage)` - Link a dataset file to an entity
- `unlinkAndDeleteFilesForEntity(usage)` - Delete all files for an entity
- `replaceSingleFile(oldDatasetId, newDatasetId, usage)` - Replace old file with new

**Specialized Functions:**
- `deleteEventFiles(eventId)` - Delete files for an event
- `replaceMemberCV(memberId, oldDatasetId, newDatasetId)` - Replace member CV
- `replaceFaviconOrLogo(settingKey, oldDataUrl, newDataUrl)` - Replace favicon/logo

### Entity Types

- `EVENT` - Event images (linked via `eventId`)
- `MEMBER_CV` - Member CV PDFs (linked via `source="member-cv"`)
- `FAVICON` - Site favicon (linked via `source="favicon"`)
- `LOGO` - Site logo (linked via `source="logo"`)

### Integration Points

1. **Event Deletion** (`DELETE /api/events/[id]`):
   - Calls `deleteEventFiles(eventId)` before deleting event
   - Cleanup errors are non-critical (logged but don't block deletion)

2. **Member CV Update** (`PUT /api/members/[id]`):
   - Calls `replaceMemberCV()` when `cvDatasetId` changes
   - Old CV is deleted before new one is linked

3. **Favicon/Logo Update** (`PUT /api/settings`):
   - Calls `replaceFaviconOrLogo()` when favicon/logo is updated
   - Uses source-based cleanup (finds old files by `source` field)

## Consequences

### Positive

- **Prevents storage bloat** - Orphaned files are automatically cleaned up
- **Centralized logic** - All file lifecycle operations in one service
- **Non-critical errors** - Cleanup failures don't block entity operations
- **Maintainable** - Easy to add new entity types in the future

### Negative

- **Data URL limitation** - Can't extract datasetId from data URLs (workaround: source-based cleanup)
- **No soft delete** - Files are hard-deleted (no recovery option)
- **Non-atomic** - Cleanup and entity deletion are separate operations (if cleanup fails, entity is still deleted)

### Trade-offs

- **Source-based cleanup for favicon/logo** - Can't extract datasetId from data URL, so we use source field to find old files. This is acceptable because only one favicon/logo should exist at a time.
- **Non-critical cleanup errors** - If cleanup fails, we log the error but continue with entity deletion/update. This prevents partial failures from blocking user operations.

## Alternatives Considered

1. **Soft delete** - Mark files as deleted instead of hard-deleting
   - Rejected: Adds complexity, not needed for current use case

2. **Reference counting** - Track file usage count across entities
   - Rejected: Over-engineered for current needs, would require significant schema changes

3. **Background cleanup job** - Periodic job to clean orphaned files
   - Rejected: Reactive cleanup is simpler and ensures immediate cleanup

## Future Considerations

- If file recovery is needed, consider implementing soft delete
- If files need to be shared across multiple entities, consider reference counting
- For large-scale deployments, consider moving to cloud storage (S3, Azure Blob) instead of Base64

## References

- Implementation: `src/modules/files/fileService.ts`
- Tests: `src/modules/files/__tests__/fileService.test.ts`
- Integration: `src/app/api/events/[id]/route.ts`, `src/app/api/members/[id]/route.ts`, `src/app/api/settings/route.ts`


# Supabase Folder Cleanup and Organization

## Current Messy State (BEFORE)
```
/supabase/
├── CURRENT_SCHEMA_v2.3.sql ✅ (KEEP - This is our source of truth)
├── setup-curation-images-storage-final.sql ❌ (DELETE - temporary)
├── setup-curation-images-storage-fixed.sql ❌ (DELETE - temporary)  
├── setup-curation-images-storage.sql ❌ (DELETE - temporary)
├── simple-storage-policies.sql ❌ (DELETE - temporary)
└── ultra-simple-storage.sql ❌ (DELETE - temporary)
```

## Clean Production Structure (AFTER)
```
/supabase/
├── production-schema.sql ✅ (Renamed from CURRENT_SCHEMA_v2.3.sql)
├── storage-policies.sql ✅ (Final storage setup)
└── README.md ✅ (Explains what each file does)
```

## Actions Needed

### 1. Keep Only Production Files
- **Keep:** `CURRENT_SCHEMA_v2.3.sql` (rename to `production-schema.sql`)
- **Create:** `storage-policies.sql` (final storage configuration)
- **Delete:** All temporary/experimental storage files
- **Create:** `README.md` (documentation for future developers)

### 2. Update Database Schema Documentation
- Update `/docs/memory-bank/databaseSchema.md` to reference the clean file structure
- Add clear warnings about maintaining single source of truth
- Document the exact process for making schema changes

### 3. Create Maintenance Process
- Single authoritative schema file
- Clear naming convention
- Process for making changes without creating chaos

## Implementation Plan

1. **Cleanup**: Remove all temporary files
2. **Rename**: Make file names descriptive and permanent
3. **Document**: Create clear README for future developers
4. **Update**: Fix documentation to point to clean structure
5. **Lock Down**: Establish process to prevent future mess

This ensures:
- ✅ Single source of truth for database schema
- ✅ Clear file structure for future developers
- ✅ No confusion about what's current vs experimental
- ✅ Maintainable long-term solution

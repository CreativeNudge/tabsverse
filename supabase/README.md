# Tabsverse Database Files

## 🚨 CRITICAL: Single Source of Truth

This folder contains the **authoritative database schema** for Tabsverse. 

**DO NOT create multiple "fix" files or temporary experiments here.**

## Files Overview

### `production-schema.sql` 
- **PURPOSE**: Complete database schema including tables, functions, triggers, RLS policies
- **STATUS**: Production active - reflects current live database state
- **WHEN TO USE**: Initial database setup or complete rebuild
- **LAST UPDATED**: June 25, 2025

### `storage-policies.sql`
- **PURPOSE**: Supabase Storage configuration for curation images
- **STATUS**: Production active - simple policies for reliable uploads
- **WHEN TO USE**: Setting up image storage bucket and permissions
- **LAST UPDATED**: June 25, 2025

## Making Database Changes

### ❌ WRONG WAY (Creates Chaos)
```
✗ Create setup-fix-v1.sql
✗ Create setup-fix-v2.sql  
✗ Create setup-really-final.sql
✗ Create setup-actually-working.sql
```

### ✅ RIGHT WAY (Production Ready)
1. **Test locally first** - Never experiment in production
2. **Update the main file** - Modify `production-schema.sql` directly
3. **Update documentation** - Keep `/docs/memory-bank/databaseSchema.md` current
4. **Version appropriately** - Only rename file for major version changes
5. **Test thoroughly** - Ensure all features still work

## Emergency: If Database Gets Corrupted

1. **Check documentation first**: `/docs/memory-bank/databaseSchema.md`
2. **Run production schema**: `psql -f production-schema.sql`
3. **Run storage setup**: `psql -f storage-policies.sql`
4. **Verify all features** work correctly

## Current Database State

✅ **Tab creation working**  
✅ **Categories system active** (12 categories with primary + secondary)  
✅ **Auto-tag intelligence working** (triggers every 3 tabs)  
✅ **Image upload functional** (simple storage policies)  
✅ **All social features working** (likes, views, follows)  
✅ **User profile auto-creation working** (auth trigger)  

## Future Developers: Please Maintain This Structure

- Keep this folder clean and organized
- Don't create experimental files here
- Update documentation when making changes
- Test changes before committing
- One authoritative source per feature

**Remember: Complex problems don't require complex file structures. Simple, well-documented files are better than many confusing ones.**

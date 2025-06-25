#!/bin/bash

# Tabsverse Database Folder Cleanup Script
# This script removes all the confusing "fix" files and keeps only what matters

echo "🧹 Cleaning up Tabsverse supabase folder..."

# Navigate to supabase directory
cd /Users/karinadalca/Desktop/tabsverse/supabase

# Create backup of current mess (just in case)
echo "📦 Creating backup of current files..."
mkdir -p ../backups/supabase-mess-$(date +%Y%m%d)
cp *.sql ../backups/supabase-mess-$(date +%Y%m%d)/

# Remove all the confusing fix files
echo "🗑️  Removing confusing fix files..."
rm -f add_categories_migration.sql
rm -f auto_tag_intelligence.sql
rm -f limit_tags.sql
rm -f fix_trigger_conflicts.sql
rm -f complete_trigger_rebuild.sql
rm -f clean_rebuild_triggers.sql
rm -f complete_fresh_rebuild.sql
rm -f debug_current_state.sql
rm -f production_user_trigger.sql
rm -f tabsverse_complete_reset.sql

echo "✅ Cleanup complete!"
echo ""
echo "📁 Files remaining in supabase folder:"
ls -la

echo ""
echo "📋 Summary:"
echo "✅ Kept: CURRENT_SCHEMA_v2.3.sql (the only file that matters)"
echo "🗑️  Removed: All confusing migration/fix files"
echo "📦 Backup: All removed files saved to ../backups/supabase-mess-$(date +%Y%m%d)/"
echo ""
echo "🎯 Going forward:"
echo "   - Use CURRENT_SCHEMA_v2.3.sql as the single source of truth"
echo "   - Update docs/memory-bank/databaseSchema.md when making changes"
echo "   - Never create multiple fix files again"

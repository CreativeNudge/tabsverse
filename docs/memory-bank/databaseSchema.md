# Database Schema Documentation

## Version 2.3 - Production Ready Schema
**Last Updated:** June 25, 2025  
**Status:** PRODUCTION ACTIVE - This reflects the ACTUAL current database state  
**Authoritative Schema File:** `/supabase/production-schema.sql`  
**Storage Configuration:** `/supabase/storage-policies.sql`

---

## ⚠️ CRITICAL: Single Source of Truth

**This documentation reflects the ACTUAL, CURRENT database schema.**  
**The files in `/supabase/` contain the complete, working schema.**

### Clean File Structure
```
/supabase/
├── production-schema.sql     ✅ Complete database schema
├── storage-policies.sql      ✅ Image storage configuration
├── README.md                 ✅ Maintenance instructions
└── archived-temp-files/      📁 Old experimental files (ignore)
```

### Before Making ANY Database Changes:
1. **Read this documentation** to understand current state
2. **Reference `/supabase/production-schema.sql`** for exact implementation
3. **Test changes locally first** - Never experiment in production
4. **Update the main schema file** - Don't create temporary "fix" files
5. **Update this documentation** when changes are made
6. **Test thoroughly** before considering changes complete

### Current Working State (June 25, 2025):
✅ **Tab creation works perfectly**  
✅ **Categories system active** (primary + optional secondary)  
✅ **Auto-tag intelligence active** (updates every 3 tabs)  
✅ **User profiles auto-created** via auth trigger  
✅ **All social features functional**  
✅ **Analytics tracking active**  
✅ **Image upload functional** (simple storage policies)  

---

## Database Overview

Tabsverse uses PostgreSQL through Supabase with these core entities:
- **Users** - User profiles extending Supabase auth.users (AUTO-CREATED via trigger)
- **Groups** - Collections of saved tabs with categories (Instagram-style posts)
- **Tabs** - Individual saved links/content within groups
- **Categories** - 12 exhaustive categories for organization and discovery
- **Auto-Tag Intelligence** - Automatic tag generation based on content analysis
- **Social Layer** - Following, likes, comments for community features
- **Analytics** - Views and click tracking for insights

## Current Schema Features

### ✅ Auto User Profile Creation
- **Status:** PRODUCTION ACTIVE
- **Function:** `public.handle_new_user()`
- **Trigger:** `on_auth_user_created` on `auth.users`
- **Benefits:** Zero race conditions, 100% coverage for all signup methods

### ✅ Categories System  
- **Status:** PRODUCTION ACTIVE
- **Type:** `collection_category` enum with 12 categories
- **Structure:** Primary category (required) + optional secondary category
- **Discovery:** Primary = full weight, secondary = 0.3x weight in algorithms
- **Categories:** technology, design, business, education, lifestyle, travel, food, entertainment, news, shopping, home, finance

### ✅ Auto-Tag Intelligence
- **Status:** PRODUCTION ACTIVE  
- **Trigger:** Every 3 tabs added (3rd, 6th, 9th, etc.)
- **Sources:** Category base tags + domain analysis + content keywords
- **Domain Mapping:** 40+ popular domains (GitHub, Dribbble, YouTube, etc.)
- **Limit:** Maximum 15 tags per collection

### ✅ Tab Count Management
- **Status:** WORKING PERFECTLY
- **Function:** `public.handle_tab_count_change()`
- **Trigger:** `tabsverse_tab_count_trigger`
- **Logic:** Simple increment/decrement with explicit table references
- **No Ambiguity:** Fixed the "tab_count ambiguous" error permanently

## Current Tables

### Users Table
```sql
public.users
├── id (UUID, PK, FK to auth.users)
├── email (TEXT, NOT NULL)
├── username (TEXT, UNIQUE, NULLABLE)
├── full_name (TEXT, NULLABLE)
├── avatar_url (TEXT, NULLABLE)
├── bio (TEXT, NULLABLE)
├── signup_ip (INET, NULLABLE)
├── signup_country (TEXT, NULLABLE)
├── last_login_ip (INET, NULLABLE)
├── created_at (TIMESTAMP WITH TIME ZONE)
├── updated_at (TIMESTAMP WITH TIME ZONE, AUTO-UPDATED)
├── subscription_tier (subscription_tier, DEFAULT 'free')
├── subscription_status (subscription_status, DEFAULT 'active')
├── settings (JSONB, DEFAULT '{}')
└── stats (JSONB, DEFAULT '{}')
```

### Groups Table (Collections)
```sql
public.groups
├── id (UUID, PK)
├── user_id (UUID, FK to users)
├── title (TEXT, NOT NULL)
├── description (TEXT, NULLABLE)
├── slug (TEXT, NOT NULL)
├── cover_image_url (TEXT, NULLABLE)
├── visibility (visibility, DEFAULT 'private')
├── primary_category (collection_category, NOT NULL, DEFAULT 'technology')
├── secondary_category (collection_category, NULLABLE)
├── tab_count (INTEGER, DEFAULT 0, AUTO-UPDATED)
├── view_count (INTEGER, DEFAULT 0)
├── like_count (INTEGER, DEFAULT 0)
├── comment_count (INTEGER, DEFAULT 0)
├── comments_enabled (BOOLEAN, DEFAULT true)
├── created_at (TIMESTAMP WITH TIME ZONE)
├── updated_at (TIMESTAMP WITH TIME ZONE, AUTO-UPDATED)
├── last_activity_at (TIMESTAMP WITH TIME ZONE, AUTO-UPDATED)
├── tags (TEXT[], AUTO-UPDATED via intelligence)
├── settings (JSONB, DEFAULT '{}')
├── UNIQUE(user_id, slug)
└── CHECK (secondary_category IS NULL OR primary_category != secondary_category)
```

### Tabs Table
```sql
public.tabs
├── id (UUID, PK)
├── group_id (UUID, FK to groups)
├── user_id (UUID, FK to users)
├── url (TEXT, NOT NULL)
├── title (TEXT, NOT NULL)
├── description (TEXT, NULLABLE)
├── thumbnail_url (TEXT, NULLABLE)
├── favicon_url (TEXT, NULLABLE)
├── domain (TEXT, NULLABLE)
├── resource_type (resource_type, DEFAULT 'webpage')
├── position (INTEGER, DEFAULT 0)
├── click_count (INTEGER, DEFAULT 0)
├── added_at (TIMESTAMP WITH TIME ZONE)
├── tags (TEXT[], DEFAULT '{}')
├── notes (TEXT, NULLABLE)
├── is_favorite (BOOLEAN, DEFAULT false)
└── metadata (JSONB, DEFAULT '{}')
```

## Active Triggers & Functions

### Tab Management Triggers
```sql
-- Tab count trigger (WORKING)
CREATE TRIGGER tabsverse_tab_count_trigger
    AFTER INSERT OR DELETE ON public.tabs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_tab_count_change();

-- Auto-tag trigger (WORKING)  
CREATE TRIGGER tabsverse_auto_tag_trigger
    AFTER INSERT ON public.tabs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auto_tag_update();
```

### Intelligence Functions
```sql
-- Domain to tags mapping (40+ domains)
public.get_domain_tags(domain_name TEXT) RETURNS TEXT[]

-- Category to base tags mapping (12 categories)
public.get_category_base_tags(category collection_category) RETURNS TEXT[]

-- Intelligent tag analysis (combines category + domain + content)
public.analyze_collection_for_tags(collection_id UUID) RETURNS TEXT[]
```

## Row Level Security (RLS)

### Active Policies
- **Users:** Can only view/edit their own profile
- **Groups:** Public groups visible to all, private only to owner
- **Tabs:** Visible if parent group is accessible  
- **Social Features:** Users can interact with public content, manage own interactions
- **Analytics:** Anyone can create tracking data, only owners can view aggregated data

## Performance Indexes

### Critical Indexes (All Active)
```sql
-- Groups (most important)
idx_groups_user_id, idx_groups_visibility, idx_groups_updated_at
idx_groups_primary_category, idx_groups_secondary_category
idx_groups_primary_category_visibility, idx_groups_secondary_category_visibility

-- Tabs
idx_tabs_group_id, idx_tabs_user_id, idx_tabs_position

-- Social
idx_follows_follower_id, idx_group_likes_group_id, idx_group_comments_group_id

-- Analytics  
idx_group_views_group_id, idx_tab_clicks_tab_id
```

## Common Query Patterns

### Get User's Groups with Categories
```sql
SELECT 
  g.*,
  u.username, u.full_name, u.avatar_url
FROM groups g
JOIN users u ON u.id = g.user_id
WHERE g.user_id = $1 
ORDER BY g.updated_at DESC;
```

### Get Group with All Tabs
```sql
SELECT 
  g.*,
  u.username, u.full_name, u.avatar_url,
  json_agg(
    json_build_object(
      'id', t.id,
      'url', t.url,
      'title', t.title,
      'thumbnail_url', t.thumbnail_url,
      'position', t.position
    ) ORDER BY t.position
  ) as tabs
FROM groups g
JOIN users u ON u.id = g.user_id
LEFT JOIN tabs t ON t.group_id = g.id
WHERE g.id = $1
GROUP BY g.id, u.id;
```

### Category-Based Discovery
```sql
-- Get public groups by category
SELECT g.*, u.username, u.full_name, u.avatar_url
FROM groups g
JOIN users u ON u.id = g.user_id
WHERE g.visibility = 'public'
AND (g.primary_category = $1 OR g.secondary_category = $1)
ORDER BY g.view_count DESC, g.like_count DESC
LIMIT 20;
```

## File Management

### Current Files to Keep
- ✅ `/supabase/CURRENT_SCHEMA_v2.3.sql` - Complete working schema
- ✅ `/docs/memory-bank/databaseSchema.md` - This documentation file

### Files to Delete (Cleanup Needed)
- ❌ `/supabase/add_categories_migration.sql` - Merged into main schema
- ❌ `/supabase/auto_tag_intelligence.sql` - Merged into main schema  
- ❌ `/supabase/limit_tags.sql` - Incomplete/unused
- ❌ `/supabase/fix_trigger_conflicts.sql` - Superseded
- ❌ `/supabase/complete_trigger_rebuild.sql` - Superseded
- ❌ `/supabase/clean_rebuild_triggers.sql` - Superseded
- ❌ `/supabase/complete_fresh_rebuild.sql` - Final working version, now merged
- ❌ `/supabase/debug_current_state.sql` - Debug file, no longer needed

## Migration History

### Version 2.3 (June 25, 2025) - CURRENT
- **Fixed tab_count ambiguity error** that was preventing tab creation
- **Simplified trigger system** with explicit table references
- **Consolidated all working features** into single schema file
- **Cleaned up conflicting functions** and triggers
- **Production ready** - all features working correctly
- Status: **ACTIVE IN PRODUCTION**

### Version 2.2 (June 25, 2025)
- Added categories system with primary + optional secondary
- Added auto-tag intelligence with domain analysis
- Status: **SUPERSEDED - Had trigger conflicts**

### Version 2.1 (June 24, 2025)  
- Added automatic user profile creation trigger
- Status: **SUPERSEDED**

## Future Development Guidelines

### Making Schema Changes
1. **Start with this documentation** to understand current state
2. **Test changes locally** first
3. **Update the main schema file** `/supabase/CURRENT_SCHEMA_v2.3.sql`
4. **Update this documentation** to reflect changes
5. **Never create multiple "fix" files** - maintain one authoritative source

### Avoiding Future Issues
- **Use explicit table references** in all functions (`public.groups.tab_count`)
- **Test trigger interactions** before deploying
- **Keep one authoritative schema file** instead of many migration files
- **Document breaking changes** clearly
- **Version the schema file name** when making major changes

---

**🔴 REMEMBER: This documentation must be updated whenever schema changes are made!**

**Current Status: ✅ PRODUCTION READY - All features working correctly as of June 25, 2025**

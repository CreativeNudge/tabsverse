# Database Schema Documentation

## Version 2.1 - Production Schema with Auto User Profile Creation
**Last Updated:** June 24, 2025  
**Status:** Production Ready - ACTIVE SCHEMA  
**Schema File:** `/supabase/database-schema.sql`
**Auto User Profiles:** ✅ IMPLEMENTED via Database Trigger

---

## ⚠️ CRITICAL: Schema Change Protocol

**This is the AUTHORITATIVE database schema documentation.**  
**ALL development sessions must reference this file before making ANY database changes.**

### Before Making Schema Changes:
1. **Check this file** for current schema state
2. **Update this documentation** when schema changes are made
3. **Test changes** in development first
4. **Update the schema version** and last updated date

---

## Database Overview

Tabsverse uses PostgreSQL through Supabase with these core entities:
- **Users** - User profiles extending Supabase auth.users (AUTO-CREATED via trigger)
- **Groups** - Collections of saved tabs (Instagram-style posts)
- **Tabs** - Individual saved links/content within groups
- **Social Layer** - Following, likes, comments for community features
- **Analytics** - Views and click tracking for monetization insights

### 🚀 **Automatic User Profile Creation**
**Status:** ✅ PRODUCTION ACTIVE  
When users sign up via Supabase Auth, a database trigger automatically creates their profile in `public.users`. This ensures:
- **Zero race conditions** between auth and profile creation
- **100% coverage** for all signup methods (email, OAuth, magic links)
- **Atomic operations** - both auth user and profile created together
- **No application logic required** - works at database level

**Trigger Function:** `public.handle_new_user()`  
**Trigger Name:** `on_auth_user_created`  
**Applied To:** `auth.users` AFTER INSERT

## Custom Types (Enums)

```sql
-- Content types for rich previews
CREATE TYPE public.resource_type AS ENUM ('webpage', 'pdf', 'video', 'image', 'document');

-- Group visibility settings
CREATE TYPE public.visibility AS ENUM ('private', 'public');

-- User subscription management
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'trialing');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'team');
```

---

## Core Tables

### 1. Users Table
**Purpose:** User profiles extending Supabase auth.users (1:1 relationship)

```sql
public.users
├── id (UUID, PK, FK to auth.users) -- Links to Supabase auth
├── email (TEXT, NOT NULL)
├── username (TEXT, UNIQUE, NULLABLE) -- Optional, can use full_name
├── full_name (TEXT, NULLABLE)
├── avatar_url (TEXT, NULLABLE)
├── bio (TEXT, NULLABLE)
├── signup_ip (INET, NULLABLE) -- Geographic analytics
├── signup_country (TEXT, NULLABLE) -- Geographic analytics
├── last_login_ip (INET, NULLABLE) -- Activity tracking
├── created_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
├── updated_at (TIMESTAMP WITH TIME ZONE, DEFAULT now(), AUTO-UPDATED)
├── subscription_tier (subscription_tier, DEFAULT 'free')
├── subscription_status (subscription_status, DEFAULT 'active')
├── settings (JSONB, DEFAULT '{}') -- Privacy, notifications, display prefs
└── stats (JSONB, DEFAULT '{"total_groups": 0, "total_tabs": 0, "followers_count": 0, "following_count": 0, "total_views": 0}')
```

**Key Features:**
- Automatic `updated_at` trigger
- IP tracking for analytics
- JSONB settings for flexible preferences
- JSONB stats for dashboard metrics
- RLS: Users can only view/edit their own profile

### 2. Groups Table
**Purpose:** User-created collections of tabs (Instagram-style posts)

```sql
public.groups
├── id (UUID, PK, DEFAULT gen_random_uuid())
├── user_id (UUID, FK to users, NOT NULL)
├── title (TEXT, NOT NULL)
├── description (TEXT, NULLABLE)
├── slug (TEXT, NOT NULL) -- For SEO-friendly URLs like /user/my-ai-tools
├── cover_image_url (TEXT, NULLABLE) -- Hero image for the collection
├── visibility (visibility, DEFAULT 'private') -- public/private
├── tab_count (INTEGER, DEFAULT 0, AUTO-UPDATED) -- Via triggers
├── view_count (INTEGER, DEFAULT 0, AUTO-UPDATED) -- Via analytics
├── like_count (INTEGER, DEFAULT 0, AUTO-UPDATED) -- Via triggers
├── comment_count (INTEGER, DEFAULT 0, AUTO-UPDATED) -- Via triggers
├── comments_enabled (BOOLEAN, DEFAULT true)
├── created_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
├── updated_at (TIMESTAMP WITH TIME ZONE, DEFAULT now(), AUTO-UPDATED)
├── last_activity_at (TIMESTAMP WITH TIME ZONE, DEFAULT now(), AUTO-UPDATED) -- For feed sorting
├── tags (TEXT[], DEFAULT '{}') -- Flexible categorization
├── settings (JSONB, DEFAULT '{"allow_comments": true, "display_style": "grid", "personality": "creative"}')
└── UNIQUE(user_id, slug) -- Unique slugs per user
```

**Key Features:**
- Automatic counter updates via triggers
- Slug-based URLs for SEO
- Personality-based styling via settings
- Activity tracking for feed algorithms
- RLS: Public groups visible to all, private only to owner

### 3. Tabs Table
**Purpose:** Individual saved links/content within groups

```sql
public.tabs
├── id (UUID, PK, DEFAULT gen_random_uuid())
├── group_id (UUID, FK to groups, NOT NULL)
├── user_id (UUID, FK to users, NOT NULL) -- For permissions
├── url (TEXT, NOT NULL)
├── title (TEXT, NOT NULL)
├── description (TEXT, NULLABLE)
├── thumbnail_url (TEXT, NULLABLE) -- Rich preview image
├── favicon_url (TEXT, NULLABLE) -- Site branding
├── domain (TEXT, NULLABLE) -- Extracted from URL
├── resource_type (resource_type, DEFAULT 'webpage') -- Content categorization
├── position (INTEGER, DEFAULT 0) -- Custom ordering within group
├── click_count (INTEGER, DEFAULT 0) -- Analytics tracking
├── added_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
├── tags (TEXT[], DEFAULT '{}') -- Tab-level categorization
├── notes (TEXT, NULLABLE) -- User's personal notes
├── is_favorite (BOOLEAN, DEFAULT false) -- User favorites
└── metadata (JSONB, DEFAULT '{}') -- og_title, reading_time, etc.
```

**Key Features:**
- Rich metadata for beautiful previews
- Custom ordering within groups
- Personal notes separate from public description
- Click tracking for conversion analytics
- RLS: Visible if parent group is accessible

---

## Social Features Tables

### 4. Follows Table
**Purpose:** User following relationships

```sql
public.follows
├── id (UUID, PK, DEFAULT gen_random_uuid())
├── follower_id (UUID, FK to users, NOT NULL)
├── following_id (UUID, FK to users, NOT NULL)
├── created_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
├── notification_enabled (BOOLEAN, DEFAULT true)
├── UNIQUE(follower_id, following_id)
└── CHECK (follower_id != following_id) -- Prevent self-following
```

### 5. Group Likes Table
**Purpose:** Like functionality for groups

```sql
public.group_likes
├── id (UUID, PK, DEFAULT gen_random_uuid())
├── group_id (UUID, FK to groups, NOT NULL)
├── user_id (UUID, FK to users, NOT NULL)
├── created_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
└── UNIQUE(group_id, user_id) -- One like per user per group
```

### 6. Group Comments Table
**Purpose:** Comments on groups with threading support

```sql
public.group_comments
├── id (UUID, PK, DEFAULT gen_random_uuid())
├── group_id (UUID, FK to groups, NOT NULL)
├── user_id (UUID, FK to users, NOT NULL)
├── content (TEXT, NOT NULL)
├── created_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
├── updated_at (TIMESTAMP WITH TIME ZONE, DEFAULT now(), AUTO-UPDATED)
├── parent_comment_id (UUID, FK to group_comments, NULLABLE) -- For replies
└── is_deleted (BOOLEAN, DEFAULT false) -- Soft delete
```

---

## Analytics Tables

### 7. Group Views Table
**Purpose:** Track group views for analytics and monetization

```sql
public.group_views
├── id (UUID, PK, DEFAULT gen_random_uuid())
├── group_id (UUID, FK to groups, NOT NULL)
├── viewer_id (UUID, FK to users, NULLABLE) -- NULL for anonymous
├── viewer_ip (INET, NULLABLE) -- Geographic analytics
├── viewer_country (TEXT, NULLABLE) -- Extracted from IP
├── user_agent (TEXT, NULLABLE) -- Device analytics
├── viewed_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
├── session_id (TEXT, NULLABLE) -- Session tracking
└── referrer (TEXT, NULLABLE) -- Traffic source analysis
```

### 8. Tab Clicks Table
**Purpose:** Track individual tab clicks for conversion analysis

```sql
public.tab_clicks
├── id (UUID, PK, DEFAULT gen_random_uuid())
├── tab_id (UUID, FK to tabs, NOT NULL)
├── user_id (UUID, FK to users, NULLABLE) -- NULL for anonymous
├── click_ip (INET, NULLABLE)
├── click_country (TEXT, NULLABLE)
├── clicked_at (TIMESTAMP WITH TIME ZONE, DEFAULT now())
└── session_id (TEXT, NULLABLE)
```

---

## Database Functions & Triggers

### User Profile Auto-Creation (Production Feature)

#### Auto User Profile Trigger ✅ ACTIVE
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $
BEGIN
  INSERT INTO public.users (
    id, email, full_name, avatar_url, username
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NULL  -- username set later by user choice
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Benefits:**
- **Bulletproof**: Works for ALL signup methods (email, OAuth, magic links)
- **Atomic**: Profile creation happens in same transaction as auth user
- **Zero Maintenance**: Set once, works forever
- **Error Handling**: Graceful degradation if profile creation fails

### Automatic Update Functions

#### 1. Updated At Trigger
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
-- Automatically updates 'updated_at' field on row changes
-- Applied to: users, groups, group_comments
```

#### 2. Counter Update Functions
```sql
CREATE OR REPLACE FUNCTION public.update_group_tab_count()
-- Automatically updates groups.tab_count when tabs added/removed

CREATE OR REPLACE FUNCTION public.update_group_like_count()
-- Automatically updates groups.like_count when likes added/removed

CREATE OR REPLACE FUNCTION public.update_group_comment_count()
-- Automatically updates groups.comment_count when comments added/removed
```

**All counter functions also update `last_activity_at` for feed sorting.**

---

## Performance Indexes

### Critical Indexes
```sql
-- Users
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);

-- Groups (most important for performance)
CREATE INDEX idx_groups_user_id ON public.groups(user_id);
CREATE INDEX idx_groups_visibility ON public.groups(visibility);
CREATE INDEX idx_groups_updated_at ON public.groups(updated_at DESC);
CREATE INDEX idx_groups_last_activity_at ON public.groups(last_activity_at DESC);
CREATE INDEX idx_groups_user_slug ON public.groups(user_id, slug);

-- Tabs
CREATE INDEX idx_tabs_group_id ON public.tabs(group_id);
CREATE INDEX idx_tabs_user_id ON public.tabs(user_id);
CREATE INDEX idx_tabs_position ON public.tabs(group_id, position);

-- Social features
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_group_likes_group_id ON public.group_likes(group_id);
CREATE INDEX idx_group_comments_group_id ON public.group_comments(group_id);

-- Analytics (for reporting queries)
CREATE INDEX idx_group_views_group_id ON public.group_views(group_id);
CREATE INDEX idx_group_views_viewed_at ON public.group_views(viewed_at DESC);
CREATE INDEX idx_tab_clicks_tab_id ON public.tab_clicks(tab_id);
CREATE INDEX idx_tab_clicks_clicked_at ON public.tab_clicks(clicked_at DESC);
```

---

## Row Level Security (RLS) Policies

### Users Table Policies
- **SELECT**: Users can view their own profile only
- **UPDATE**: Users can update their own profile only  
- **INSERT**: Users can create their own profile only (auth.uid() = id)

### Groups Table Policies  
- **SELECT**: Public groups visible to everyone, private groups only to owner
- **ALL OPERATIONS**: Users can manage only their own groups

### Tabs Table Policies
- **SELECT**: Visible if parent group is accessible
- **ALL OPERATIONS**: Users can manage only their own tabs

### Social Feature Policies
- **Follows**: Users can view relationships they're part of, manage only their own follows
- **Likes/Comments**: Can interact with public groups, manage own interactions

### Analytics Policies
- **Views/Clicks**: Anyone can CREATE (for tracking), only owners can SELECT their data

---

## TypeScript Integration

### Database Type Generation
```typescript
// Auto-generated from Supabase CLI
export type Database = {
  public: {
    Tables: {
      users: { Row: UserRow, Insert: UserInsert, Update: UserUpdate }
      groups: { Row: GroupRow, Insert: GroupInsert, Update: GroupUpdate }
      tabs: { Row: TabRow, Insert: TabInsert, Update: TabUpdate }
      // ... all other tables
    }
    Enums: {
      resource_type: 'webpage' | 'pdf' | 'video' | 'image' | 'document'
      visibility: 'private' | 'public'
      subscription_status: 'active' | 'cancelled' | 'trialing'
      subscription_tier: 'free' | 'pro' | 'team'
    }
  }
}
```

### Extended Types for Frontend
```typescript
// Extended types with relationships
export interface GroupWithUser extends Group {
  user: Pick<User, 'id' | 'username' | 'full_name' | 'avatar_url'>
}

export interface GroupWithStats extends Group {
  user: Pick<User, 'id' | 'username' | 'full_name' | 'avatar_url'>
  tabs?: Tab[]
  _count?: {
    tabs: number
    likes: number  
    comments: number
    views: number
  }
}
```

---

## Common Query Patterns

### 1. Get User's Groups with Stats
```sql
SELECT 
  g.*,
  u.username, u.full_name, u.avatar_url
FROM groups g
JOIN users u ON u.id = g.user_id
WHERE g.user_id = $1 
ORDER BY g.updated_at DESC;
```

### 2. Get Group with All Tabs
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
      'position', t.position,
      'click_count', t.click_count
    ) ORDER BY t.position
  ) as tabs
FROM groups g
JOIN users u ON u.id = g.user_id
LEFT JOIN tabs t ON t.group_id = g.id
WHERE g.id = $1
GROUP BY g.id, u.id;
```

### 3. Get Public Feed (Following + Discovery)
```sql
-- User's feed from followed users
SELECT g.*, u.username, u.full_name, u.avatar_url
FROM groups g
JOIN users u ON u.id = g.user_id
JOIN follows f ON f.following_id = g.user_id
WHERE f.follower_id = $1 
  AND g.visibility = 'public'
ORDER BY g.last_activity_at DESC
LIMIT 20;

-- Discovery feed (trending public groups)
SELECT g.*, u.username, u.full_name, u.avatar_url
FROM groups g
JOIN users u ON u.id = g.user_id
WHERE g.visibility = 'public'
ORDER BY g.view_count DESC, g.like_count DESC
LIMIT 20;
```

---

## Current API Integration

### Key API Endpoints Using This Schema

#### `/api/curations` (Groups Management)
- **GET**: Fetch user's groups with user info
- **POST**: Create new group with auto-generated slug
- Uses: `groups` table with `users` join

#### `/api/curations/limit` (Free Tier Limits)
- **GET**: Check user's group count vs limit (5 for free tier)
- Uses: `groups` table count by user_id

### Code Files Using Schema
- `/lib/hooks/useGroups.ts` - React Query hooks for groups
- `/app/api/curations/route.ts` - Groups CRUD operations
- `/lib/utils/dataTransforms.ts` - Type-safe data transformations

---

## Schema Evolution Strategy

### Version Control
- **Current Version**: 2.1 (June 24, 2025)
- **Schema File**: `/supabase/database-schema.sql` (complete rebuild script)
- **Auto User Profiles**: ✅ Production trigger implemented
- **Documentation**: This file (must be updated with changes)

### Adding New Features
1. **Document planned changes** in this file first
2. **Create migration script** for incremental changes
3. **Test in development** environment
4. **Update TypeScript types** after schema changes
5. **Update this documentation** with new structure

### Critical Constraints
- **Never break existing API contracts** without proper migrations
- **Always consider RLS policies** for new tables
- **Add appropriate indexes** for query performance
- **Update triggers/functions** if counter logic changes

---

## Monitoring & Maintenance

### Performance Monitoring
- Monitor query performance on `groups` table (most critical)
- Watch for slow analytics queries as data grows
- Consider partitioning analytics tables by date if needed

### Data Retention
- Analytics tables will grow rapidly - consider retention policies
- Soft-deleted comments may need cleanup processes
- User stats should be recalculated periodically for accuracy

### Security Audits
- Regularly review RLS policies for data exposure
- Monitor for SQL injection attempts
- Ensure all user input is properly validated

---

## Migration History

### Version 2.1 (June 24, 2025)
- **Added automatic user profile creation trigger** for production reliability
- **Trigger Function**: `public.handle_new_user()` auto-creates `public.users` records
- **Trigger**: `on_auth_user_created` fires AFTER INSERT on `auth.users`
- **Benefits**: Eliminates foreign key constraint errors, bulletproof user onboarding
- **Coverage**: Works for email signup, OAuth, magic links, all auth methods
- Status: **ACTIVE IN PRODUCTION**

### Version 2.0 (June 24, 2025)
- **Complete rebuild** from previous partial schema
- Added all missing tables: tabs, social features, analytics
- Implemented automatic counters with triggers
- Added comprehensive RLS policies
- Added performance indexes
- Status: **DEPRECATED - UPGRADED TO 2.1**

### Version 1.0 (Previous)
- Basic users and groups tables only
- Missing social features, analytics, and many fields
- Status: **DEPRECATED - REPLACED**

---

**🔴 REMEMBER: Update this documentation whenever schema changes are made!**
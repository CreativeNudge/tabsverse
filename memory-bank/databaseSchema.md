# Database Schema Documentation

## Version 1.0 - MVP Schema
**Last Updated:** June 2025  
**Status:** Ready for Production

## Overview
Tabsverse uses a PostgreSQL database through Supabase with the following core entities:
- **Users** - Account holders with social profiles
- **Groups** - Collections of saved tabs (renamed from "collections")
- **Tabs** - Individual saved links/content
- **Social Layer** - Following, likes, comments
- **Analytics** - Views and click tracking for future monetization

## Core Entities

### Users Table
**Purpose:** User profiles extending Supabase auth.users

```sql
public.users
├── id (UUID, PK, FK to auth.users)
├── email (TEXT, NOT NULL)
├── username (TEXT, UNIQUE)
├── full_name (TEXT)
├── avatar_url (TEXT)
├── bio (TEXT)
├── signup_ip (INET) -- for analytics
├── signup_country (TEXT) -- for analytics
├── last_login_ip (INET) -- for analytics
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── subscription_tier (ENUM: free, pro, team)
├── subscription_status (ENUM: active, cancelled, trialing)
├── settings (JSONB) -- privacy, notifications, display prefs
└── stats (JSONB) -- total_groups, followers_count, etc.
```

**Key Points:**
- Extends Supabase auth.users (1:1 relationship)
- IP tracking for future geographic analytics
- JSONB fields for flexible settings and stats
- Username is optional (can use full_name)

### Groups Table
**Purpose:** User-created collections of tabs (Instagram-style posts)

```sql
public.groups
├── id (UUID, PK)
├── user_id (UUID, FK to users, NOT NULL)
├── title (TEXT, NOT NULL)
├── description (TEXT)
├── slug (TEXT, NOT NULL) -- for URLs like /user/my-ai-tools
├── cover_image_url (TEXT)
├── visibility (ENUM: private, public)
├── tab_count (INTEGER, DEFAULT 0) -- auto-updated
├── view_count (INTEGER, DEFAULT 0) -- auto-updated
├── like_count (INTEGER, DEFAULT 0) -- auto-updated
├── comment_count (INTEGER, DEFAULT 0) -- auto-updated
├── comments_enabled (BOOLEAN, DEFAULT true)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── last_activity_at (TIMESTAMP) -- for sorting
├── tags (TEXT[]) -- for categorization
└── settings (JSONB) -- allow_comments, display_style
```

**Key Points:**
- "Groups" instead of "collections" for simplicity
- Automatic counter updates via triggers
- Slug for SEO-friendly URLs
- Tags array for flexible categorization
- Comments can be disabled per group

### Tabs Table
**Purpose:** Individual saved links/content within groups

```sql
public.tabs
├── id (UUID, PK)
├── group_id (UUID, FK to groups, NOT NULL)
├── user_id (UUID, FK to users, NOT NULL)
├── url (TEXT, NOT NULL)
├── title (TEXT, NOT NULL)
├── description (TEXT)
├── thumbnail_url (TEXT) -- for rich previews
├── favicon_url (TEXT) -- for branding
├── domain (TEXT) -- extracted from URL
├── resource_type (ENUM: webpage, pdf, video, image, document)
├── position (INTEGER, DEFAULT 0) -- for ordering
├── click_count (INTEGER, DEFAULT 0) -- for analytics
├── added_at (TIMESTAMP)
├── tags (TEXT[]) -- tab-level tags
├── notes (TEXT) -- user's personal notes
├── is_favorite (BOOLEAN, DEFAULT false)
└── metadata (JSONB) -- og_title, reading_time, etc.
```

**Key Points:**
- Rich metadata for beautiful previews
- Position field for custom ordering
- Click tracking for conversion analytics
- Personal notes separate from public description

### Social Tables

#### Follows Table
```sql
public.follows
├── id (UUID, PK)
├── follower_id (UUID, FK to users, NOT NULL)
├── following_id (UUID, FK to users, NOT NULL)
├── created_at (TIMESTAMP)
├── notification_enabled (BOOLEAN, DEFAULT true)
└── UNIQUE(follower_id, following_id)
```

#### Group Likes Table
```sql
public.group_likes
├── id (UUID, PK)
├── group_id (UUID, FK to groups, NOT NULL)
├── user_id (UUID, FK to users, NOT NULL)
├── created_at (TIMESTAMP)
└── UNIQUE(group_id, user_id)
```

#### Group Comments Table
```sql
public.group_comments
├── id (UUID, PK)
├── group_id (UUID, FK to groups, NOT NULL)
├── user_id (UUID, FK to users, NOT NULL)
├── content (TEXT, NOT NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── parent_comment_id (UUID, FK to group_comments) -- for replies
└── is_deleted (BOOLEAN, DEFAULT false) -- soft delete
```

### Analytics Tables

#### Group Views Table
**Purpose:** Track views for conversion analytics and monetization

```sql
public.group_views
├── id (UUID, PK)
├── group_id (UUID, FK to groups, NOT NULL)
├── viewer_id (UUID, FK to users) -- NULL for anonymous
├── viewer_ip (INET) -- for geographic analytics
├── viewer_country (TEXT) -- extracted from IP
├── user_agent (TEXT) -- for device analytics
├── viewed_at (TIMESTAMP)
├── session_id (TEXT) -- for session tracking
└── referrer (TEXT) -- traffic source
```

#### Tab Clicks Table
**Purpose:** Track clicks for conversion analytics

```sql
public.tab_clicks
├── id (UUID, PK)
├── tab_id (UUID, FK to tabs, NOT NULL)
├── user_id (UUID, FK to users) -- NULL for anonymous
├── click_ip (INET)
├── click_country (TEXT)
├── clicked_at (TIMESTAMP)
└── session_id (TEXT)
```

## Key Features

### Automatic Counter Updates
Triggers automatically maintain:
- `groups.tab_count` when tabs added/removed
- `groups.like_count` when likes added/removed
- `groups.comment_count` when comments added/removed
- `users.stats` when groups/follows change

### Row Level Security (RLS)
- Users can only modify their own data
- Public groups visible to everyone
- Private groups only visible to owner
- Analytics data only visible to group/tab owners

### Performance Optimizations
- Strategic indexes on common query patterns
- Denormalized counters to avoid expensive aggregations
- Unique constraints to prevent duplicate data

## TypeScript Integration

### Core Types
```typescript
// Database table types
export type User = Database['public']['Tables']['users']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type Tab = Database['public']['Tables']['tabs']['Row']

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

### Settings Types
```typescript
export interface UserSettings {
  privacy_level: 'private' | 'public'
  notification_preferences: {
    email_notifications: boolean
    push_notifications: boolean
  }
  display_preferences: {
    theme: 'light' | 'dark'
    default_view: 'grid' | 'list'
  }
}

export interface UserStats {
  total_groups: number
  total_tabs: number
  followers_count: number
  following_count: number
  total_views: number
}
```

## Common Queries

### Get User's Public Groups
```sql
SELECT g.*, u.username, u.full_name, u.avatar_url
FROM groups g
JOIN users u ON u.id = g.user_id
WHERE g.user_id = $1 AND g.visibility = 'public'
ORDER BY g.updated_at DESC;
```

### Get Group with Tabs
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

### Get Feed of Followed Users' Groups
```sql
SELECT g.*, u.username, u.full_name, u.avatar_url
FROM groups g
JOIN users u ON u.id = g.user_id
JOIN follows f ON f.following_id = g.user_id
WHERE f.follower_id = $1 
  AND g.visibility = 'public'
ORDER BY g.last_activity_at DESC
LIMIT 20;
```

## Future Expansion Points

### Phase 2 Additions
- Group collaborators table (for shared editing)
- Notification system tables
- Direct messaging tables
- Group categories/topics tables

### Phase 3 Additions
- Advanced analytics aggregation tables
- Content moderation tables
- Premium feature tracking
- API usage tracking

### Monetization Features
- Subscription management
- Usage analytics for premium features
- Geographic analytics for targeting
- Conversion funnel tracking

## Migration Strategy

### Adding New Fields
Always use `ALTER TABLE ADD COLUMN` with defaults:
```sql
ALTER TABLE groups ADD COLUMN new_field TEXT DEFAULT 'default_value';
```

### Adding New Tables
Create with proper foreign keys and RLS policies:
```sql
CREATE TABLE new_feature (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);
ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;
```

### TypeScript Updates
Always update `/types/database.ts` when schema changes to maintain type safety.

## Critical Reminders

1. **Always update this document** when schema changes
2. **Test RLS policies** in Supabase before deploying
3. **Use transactions** for multi-table operations
4. **Monitor query performance** with analytics data growth
5. **Keep TypeScript types in sync** with database schema

This schema supports the MVP social bookmarking platform while providing clear expansion paths for advanced features and monetization.

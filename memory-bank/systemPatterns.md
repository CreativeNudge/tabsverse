# System Patterns

## Architecture Overview

Tabsverse implements a **social content management architecture** with clean separation between personal organization, collaborative features, and community discovery, unified under a responsive web application.

### **Application Structure**
```
tabsverse/
├── app/
│   ├── (dashboard)/           # Protected user dashboard
│   │   ├── collections/       # Personal collection management
│   │   ├── shared/           # Shared collections view
│   │   ├── discover/         # Community discovery
│   │   ├── profile/          # User profile and settings
│   │   └── analytics/        # Usage insights
│   ├── (public)/             # Public routes
│   │   ├── auth/             # Authentication pages
│   │   ├── c/                # Public collection sharing
│   │   └── u/                # Public user profiles
│   ├── api/
│   │   ├── collections/      # Collection CRUD operations
│   │   ├── resources/        # Resource management
│   │   ├── social/           # Social features (sharing, following)
│   │   ├── search/           # Search and discovery
│   │   └── auth/             # Authentication APIs
│   └── globals.css
├── components/
│   ├── ui/                   # Base UI components (shadcn/ui)
│   ├── dashboard/            # Dashboard-specific components
│   ├── collections/          # Collection views and management
│   ├── resources/            # Resource cards and forms
│   ├── social/               # Social features components
│   └── layout/               # Layout and navigation
├── lib/
│   ├── supabase/            # Database operations and queries
│   ├── auth/                # Authentication utilities
│   ├── validation/          # Form and data validation (Zod)
│   ├── utils/               # General utilities
│   └── hooks/               # Custom React hooks
├── types/                   # TypeScript definitions
├── memory-bank/             # Project documentation
└── documentation/           # Additional project docs
```

## Data Model

### **Core Entities**

#### **Users** (Account Holders)
```sql
users
├── id (uuid, primary key)
├── email (string, unique)
├── username (string, unique, optional)
├── full_name (string)
├── avatar_url (string, optional)
├── bio (text, optional)
├── created_at (timestamp)
├── updated_at (timestamp)
├── subscription_tier (enum: 'free', 'pro', 'team')
├── subscription_status (enum: 'active', 'cancelled', 'trialing')
├── settings (jsonb)
│   ├── privacy_level (enum: 'private', 'public', 'friends')
│   ├── notification_preferences (object)
│   └── display_preferences (object)
└── stats (jsonb)
    ├── total_collections (integer)
    ├── total_resources (integer)
    ├── followers_count (integer)
    └── following_count (integer)
```

#### **Collections** (Core Organization Unit)
```sql
collections
├── id (uuid, primary key)
├── user_id (uuid, foreign key → users.id)
├── title (string)
├── description (text, optional)
├── slug (string, unique per user)
├── cover_image_url (string, optional)
├── visibility (enum: 'private', 'shared', 'public')
├── resource_count (integer, default: 0)
├── created_at (timestamp)
├── updated_at (timestamp)
├── last_activity_at (timestamp)
├── tags (text[], for categorization)
├── settings (jsonb)
│   ├── allow_collaboration (boolean)
│   ├── allow_comments (boolean)
│   ├── auto_organize (boolean)
│   └── display_style (enum: 'grid', 'list', 'masonry')
└── stats (jsonb)
    ├── views_count (integer)
    ├── likes_count (integer)
    ├── shares_count (integer)
    └── collaborators_count (integer)

-- Indexes: (user_id, updated_at), (visibility, updated_at), (tags)
-- Unique constraint: (user_id, slug)
```

#### **Resources** (Saved Content Items)
```sql
resources
├── id (uuid, primary key)
├── collection_id (uuid, foreign key → collections.id)
├── user_id (uuid, foreign key → users.id)
├── url (string, indexed)
├── title (string)
├── description (text, optional)
├── thumbnail_url (string, optional)
├── favicon_url (string, optional)
├── domain (string, computed)
├── resource_type (enum: 'webpage', 'pdf', 'video', 'image', 'document')
├── added_at (timestamp)
├── position (integer, for ordering within collection)
├── tags (text[], for fine-grained categorization)
├── notes (text, user's personal notes)
├── is_favorite (boolean, default: false)
├── metadata (jsonb)
│   ├── page_title (string)
│   ├── meta_description (string)
│   ├── author (string, optional)
│   ├── publish_date (timestamp, optional)
│   └── reading_time (integer, optional)
└── stats (jsonb)
    ├── clicks_count (integer)
    ├── saves_count (integer)
    └── last_accessed_at (timestamp)

-- Indexes: (collection_id, position), (user_id, added_at), (url)
-- Unique constraint: (collection_id, url)
```

#### **Collection Collaborators** (Shared Collections)
```sql
collection_collaborators
├── id (uuid, primary key)
├── collection_id (uuid, foreign key → collections.id)
├── user_id (uuid, foreign key → users.id)
├── role (enum: 'viewer', 'editor', 'admin')
├── added_at (timestamp)
├── added_by (uuid, foreign key → users.id)
└── permissions (jsonb)
    ├── can_add_resources (boolean)
    ├── can_edit_resources (boolean)
    ├── can_delete_resources (boolean)
    └── can_invite_others (boolean)

-- Unique constraint: (collection_id, user_id)
-- Index: (user_id, added_at)
```

#### **Social Features**

##### **Follows** (User Relationships)
```sql
follows
├── id (uuid, primary key)
├── follower_id (uuid, foreign key → users.id)
├── following_id (uuid, foreign key → users.id)
├── created_at (timestamp)
└── notification_enabled (boolean, default: true)

-- Unique constraint: (follower_id, following_id)
-- Indexes: (follower_id), (following_id)
```

##### **Collection Likes**
```sql
collection_likes
├── id (uuid, primary key)
├── collection_id (uuid, foreign key → collections.id)
├── user_id (uuid, foreign key → users.id)
├── created_at (timestamp)

-- Unique constraint: (collection_id, user_id)
-- Index: (collection_id, created_at)
```

##### **Collection Comments**
```sql
collection_comments
├── id (uuid, primary key)
├── collection_id (uuid, foreign key → collections.id)
├── user_id (uuid, foreign key → users.id)
├── content (text)
├── created_at (timestamp)
├── updated_at (timestamp)
├── parent_comment_id (uuid, foreign key → collection_comments.id, optional)
└── is_deleted (boolean, default: false)

-- Index: (collection_id, created_at)
-- Index: (parent_comment_id)
```

### **Supporting Tables**

#### **Collection Views** (Analytics)
```sql
collection_views
├── id (uuid, primary key)
├── collection_id (uuid, foreign key → collections.id)
├── viewer_id (uuid, foreign key → users.id, optional)
├── ip_address (inet)
├── user_agent (string)
├── viewed_at (timestamp)
├── session_id (string)
└── referrer (string, optional)

-- Index: (collection_id, viewed_at)
-- TTL: Delete after 2 years
```

#### **Resource Clicks** (Analytics)
```sql
resource_clicks
├── id (uuid, primary key)
├── resource_id (uuid, foreign key → resources.id)
├── user_id (uuid, foreign key → users.id, optional)
├── clicked_at (timestamp)
├── ip_address (inet)
└── session_id (string)

-- Index: (resource_id, clicked_at)
-- TTL: Delete after 1 year
```

## API Design Patterns

### **Authentication Required Endpoints**

#### **Collections Management**
```javascript
GET    /api/collections              // User's collections
POST   /api/collections              // Create new collection
GET    /api/collections/[id]         // Get specific collection
PUT    /api/collections/[id]         // Update collection
DELETE /api/collections/[id]         // Delete collection

GET    /api/collections/[id]/resources    // Get collection resources
POST   /api/collections/[id]/resources    // Add resource to collection
PUT    /api/collections/[id]/resources/[resourceId]    // Update resource
DELETE /api/collections/[id]/resources/[resourceId]    // Remove resource

GET    /api/collections/[id]/collaborators    // Get collaborators
POST   /api/collections/[id]/collaborators    // Invite collaborator
DELETE /api/collections/[id]/collaborators/[userId]  // Remove collaborator
```

#### **Social Features**
```javascript
POST   /api/social/follow/[userId]       // Follow user
DELETE /api/social/follow/[userId]       // Unfollow user
GET    /api/social/followers             // Get user's followers
GET    /api/social/following             // Get users being followed

POST   /api/social/collections/[id]/like     // Like collection
DELETE /api/social/collections/[id]/like     // Unlike collection
POST   /api/social/collections/[id]/comment  // Comment on collection
```

#### **Discovery and Search**
```javascript
GET    /api/discover/trending           // Trending collections
GET    /api/discover/featured           // Featured collections
GET    /api/discover/recommendations    // Personalized recommendations
GET    /api/search/collections          // Search collections
GET    /api/search/resources            // Search resources
GET    /api/search/users                // Search users
```

### **Public Endpoints** (No Authentication Required)

#### **Public Collection Viewing**
```javascript
GET /api/public/collections/[userId]/[slug]     // Public collection
GET /api/public/users/[username]                 // Public user profile
```

## Component Architecture Patterns

### **Reusable UI Components**
- **ResourceCard**: Display individual saved resources with actions
- **CollectionCard**: Display collection preview with stats
- **UserCard**: Display user information and follow status
- **SearchBar**: Unified search component with filters
- **ShareModal**: Social sharing and collaboration invitations

### **Layout Components**
- **DashboardLayout**: Main application layout with navigation
- **CollectionLayout**: Layout for viewing/editing collections
- **PublicLayout**: Layout for public pages and sharing

### **Feature Components**
- **ResourceCapture**: Browser extension-like interface for saving
- **CollectionBuilder**: Interface for creating and organizing collections
- **SocialFeed**: Discovery and trending content display
- **CollaborationPanel**: Real-time collaboration interface

## Security Patterns

### **Authentication & Authorization**
- **User Authentication**: Supabase Auth with session management
- **Row Level Security**: Supabase RLS policies for data protection
- **Role-Based Access**: Collection-level permissions for collaboration
- **API Rate Limiting**: Prevent abuse of public endpoints

### **Privacy Controls**
- **Visibility Levels**: Private, shared, and public collection options
- **Granular Permissions**: Fine-grained control over collaboration features
- **Data Anonymization**: Analytics data anonymized after collection period

### **Content Security**
- **URL Validation**: Prevent malicious links and XSS attacks
- **Content Moderation**: Community reporting and moderation tools
- **Spam Prevention**: Rate limiting and content filtering

## Performance Patterns

### **Database Optimization**
- **Strategic Indexing**: Optimized queries for common access patterns
- **Computed Statistics**: Cached counts and aggregations
- **Pagination**: Efficient loading of large collections and feeds

### **Caching Strategy**
- **Collection Metadata**: Cache frequently accessed collection information
- **User Sessions**: Optimized session management
- **Search Results**: Cache popular search queries

### **Real-time Features**
- **Supabase Realtime**: Live updates for collaborative collections
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Efficient Syncing**: Minimal data transfer for cross-device sync

## Scalability Considerations

### **Data Architecture**
- **Horizontal Scaling**: Database designed for horizontal scaling
- **CDN Integration**: Global distribution of static assets
- **Search Optimization**: Full-text search with performance considerations

### **Feature Scaling**
- **Modular Architecture**: Features can be developed and deployed independently
- **Progressive Enhancement**: Core features work without advanced capabilities
- **API Versioning**: Future-proof API design for feature evolution

// Core TypeScript definitions for Tabsverse

export interface User {
  id: string
  email: string
  username?: string
  full_name: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
  subscription_tier: 'free' | 'pro' | 'team'
  subscription_status: 'active' | 'cancelled' | 'trialing'
  settings: UserSettings
  stats: UserStats
}

export interface UserSettings {
  privacy_level: 'private' | 'public' | 'friends'
  notification_preferences: NotificationPreferences
  display_preferences: DisplayPreferences
}

export interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  social_notifications: boolean
  collaboration_notifications: boolean
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'system'
  default_view: 'grid' | 'list' | 'masonry'
  items_per_page: number
}

export interface UserStats {
  total_collections: number
  total_resources: number
  followers_count: number
  following_count: number
}

export interface Collection {
  id: string
  user_id: string
  title: string
  description?: string
  slug: string
  cover_image_url?: string
  visibility: 'private' | 'shared' | 'public'
  resource_count: number
  created_at: string
  updated_at: string
  last_activity_at: string
  tags: string[]
  settings: CollectionSettings
  stats: CollectionStats
}

export interface CollectionSettings {
  allow_collaboration: boolean
  allow_comments: boolean
  auto_organize: boolean
  display_style: 'grid' | 'list' | 'masonry'
}

export interface CollectionStats {
  views_count: number
  likes_count: number
  shares_count: number
  collaborators_count: number
}

export interface Resource {
  id: string
  collection_id: string
  user_id: string
  url: string
  title: string
  description?: string
  thumbnail_url?: string
  favicon_url?: string
  domain: string
  resource_type: 'webpage' | 'pdf' | 'video' | 'image' | 'document'
  added_at: string
  position: number
  tags: string[]
  notes?: string
  is_favorite: boolean
  metadata: ResourceMetadata
  stats: ResourceStats
}

export interface ResourceMetadata {
  page_title: string
  meta_description: string
  author?: string
  publish_date?: string
  reading_time?: number
}

export interface ResourceStats {
  clicks_count: number
  saves_count: number
  last_accessed_at: string
}

export interface CollectionCollaborator {
  id: string
  collection_id: string
  user_id: string
  role: 'viewer' | 'editor' | 'admin'
  added_at: string
  added_by: string
  permissions: CollaboratorPermissions
}

export interface CollaboratorPermissions {
  can_add_resources: boolean
  can_edit_resources: boolean
  can_delete_resources: boolean
  can_invite_others: boolean
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  notification_enabled: boolean
}

export interface CollectionLike {
  id: string
  collection_id: string
  user_id: string
  created_at: string
}

export interface CollectionComment {
  id: string
  collection_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  parent_comment_id?: string
  is_deleted: boolean
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// Form Types
export interface CreateCollectionData {
  title: string
  description?: string
  visibility: Collection['visibility']
  tags: string[]
}

export interface UpdateCollectionData extends Partial<CreateCollectionData> {
  settings?: Partial<CollectionSettings>
}

export interface CreateResourceData {
  url: string
  title?: string
  description?: string
  notes?: string
  tags: string[]
}

export interface UpdateResourceData extends Partial<CreateResourceData> {
  position?: number
  is_favorite?: boolean
}

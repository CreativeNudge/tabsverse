export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          signup_ip: string | null
          signup_country: string | null
          last_login_ip: string | null
          created_at: string
          updated_at: string
          subscription_tier: 'free' | 'pro' | 'team'
          subscription_status: 'active' | 'cancelled' | 'trialing'
          settings: Json | null
          stats: Json | null
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          signup_ip?: string | null
          signup_country?: string | null
          last_login_ip?: string | null
          created_at?: string
          updated_at?: string
          subscription_tier?: 'free' | 'pro' | 'team'
          subscription_status?: 'active' | 'cancelled' | 'trialing'
          settings?: Json | null
          stats?: Json | null
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          signup_ip?: string | null
          signup_country?: string | null
          last_login_ip?: string | null
          created_at?: string
          updated_at?: string
          subscription_tier?: 'free' | 'pro' | 'team'
          subscription_status?: 'active' | 'cancelled' | 'trialing'
          settings?: Json | null
          stats?: Json | null
        }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          slug: string
          cover_image_url: string | null
          visibility: 'private' | 'public'
          tab_count: number
          view_count: number
          like_count: number
          comment_count: number
          comments_enabled: boolean
          created_at: string
          updated_at: string
          last_activity_at: string
          tags: string[] | null
          settings: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          slug: string
          cover_image_url?: string | null
          visibility?: 'private' | 'public'
          tab_count?: number
          view_count?: number
          like_count?: number
          comment_count?: number
          comments_enabled?: boolean
          created_at?: string
          updated_at?: string
          last_activity_at?: string
          tags?: string[] | null
          settings?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          slug?: string
          cover_image_url?: string | null
          visibility?: 'private' | 'public'
          tab_count?: number
          view_count?: number
          like_count?: number
          comment_count?: number
          comments_enabled?: boolean
          created_at?: string
          updated_at?: string
          last_activity_at?: string
          tags?: string[] | null
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tabs: {
        Row: {
          id: string
          group_id: string
          user_id: string
          url: string
          title: string
          description: string | null
          thumbnail_url: string | null
          favicon_url: string | null
          domain: string | null
          resource_type: 'webpage' | 'pdf' | 'video' | 'image' | 'document'
          position: number
          click_count: number
          added_at: string
          tags: string[] | null
          notes: string | null
          is_favorite: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          url: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          favicon_url?: string | null
          domain?: string | null
          resource_type?: 'webpage' | 'pdf' | 'video' | 'image' | 'document'
          position?: number
          click_count?: number
          added_at?: string
          tags?: string[] | null
          notes?: string | null
          is_favorite?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          url?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          favicon_url?: string | null
          domain?: string | null
          resource_type?: 'webpage' | 'pdf' | 'video' | 'image' | 'document'
          position?: number
          click_count?: number
          added_at?: string
          tags?: string[] | null
          notes?: string | null
          is_favorite?: boolean
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tabs_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
          notification_enabled: boolean
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
          notification_enabled?: boolean
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
          notification_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      group_likes: {
        Row: {
          id: string
          group_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_likes_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      group_comments: {
        Row: {
          id: string
          group_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
          parent_comment_id: string | null
          is_deleted: boolean
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
          parent_comment_id?: string | null
          is_deleted?: boolean
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          parent_comment_id?: string | null
          is_deleted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "group_comments_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            referencedRelation: "group_comments"
            referencedColumns: ["id"]
          }
        ]
      }
      group_views: {
        Row: {
          id: string
          group_id: string
          viewer_id: string | null
          viewer_ip: string | null
          viewer_country: string | null
          user_agent: string | null
          viewed_at: string
          session_id: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          group_id: string
          viewer_id?: string | null
          viewer_ip?: string | null
          viewer_country?: string | null
          user_agent?: string | null
          viewed_at?: string
          session_id?: string | null
          referrer?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          viewer_id?: string | null
          viewer_ip?: string | null
          viewer_country?: string | null
          user_agent?: string | null
          viewed_at?: string
          session_id?: string | null
          referrer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_views_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_views_viewer_id_fkey"
            columns: ["viewer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tab_clicks: {
        Row: {
          id: string
          tab_id: string
          user_id: string | null
          click_ip: string | null
          click_country: string | null
          clicked_at: string
          session_id: string | null
        }
        Insert: {
          id?: string
          tab_id: string
          user_id?: string | null
          click_ip?: string | null
          click_country?: string | null
          clicked_at?: string
          session_id?: string | null
        }
        Update: {
          id?: string
          tab_id?: string
          user_id?: string | null
          click_ip?: string | null
          click_country?: string | null
          clicked_at?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tab_clicks_tab_id_fkey"
            columns: ["tab_id"]
            referencedRelation: "tabs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tab_clicks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'pro' | 'team'
      subscription_status: 'active' | 'cancelled' | 'trialing'
      visibility: 'private' | 'public'
      resource_type: 'webpage' | 'pdf' | 'video' | 'image' | 'document'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier use
export type User = Database['public']['Tables']['users']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type Tab = Database['public']['Tables']['tabs']['Row']
export type Follow = Database['public']['Tables']['follows']['Row']
export type GroupLike = Database['public']['Tables']['group_likes']['Row']
export type GroupComment = Database['public']['Tables']['group_comments']['Row']
export type GroupView = Database['public']['Tables']['group_views']['Row']
export type TabClick = Database['public']['Tables']['tab_clicks']['Row']

export type InsertUser = Database['public']['Tables']['users']['Insert']
export type InsertGroup = Database['public']['Tables']['groups']['Insert']
export type InsertTab = Database['public']['Tables']['tabs']['Insert']
export type InsertFollow = Database['public']['Tables']['follows']['Insert']
export type InsertGroupLike = Database['public']['Tables']['group_likes']['Insert']
export type InsertGroupComment = Database['public']['Tables']['group_comments']['Insert']
export type InsertGroupView = Database['public']['Tables']['group_views']['Insert']
export type InsertTabClick = Database['public']['Tables']['tab_clicks']['Insert']

export type UpdateUser = Database['public']['Tables']['users']['Update']
export type UpdateGroup = Database['public']['Tables']['groups']['Update']
export type UpdateTab = Database['public']['Tables']['tabs']['Update']
export type UpdateFollow = Database['public']['Tables']['follows']['Update']
export type UpdateGroupLike = Database['public']['Tables']['group_likes']['Update']
export type UpdateGroupComment = Database['public']['Tables']['group_comments']['Update']
export type UpdateGroupView = Database['public']['Tables']['group_views']['Update']
export type UpdateTabClick = Database['public']['Tables']['tab_clicks']['Update']

// Enums for easier imports
export type SubscriptionTier = Database['public']['Enums']['subscription_tier']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type Visibility = Database['public']['Enums']['visibility']
export type ResourceType = Database['public']['Enums']['resource_type']

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

export interface TabWithGroup extends Tab {
  group: Pick<Group, 'id' | 'title' | 'visibility' | 'user_id'>
}

export interface CommentWithUser extends GroupComment {
  user: Pick<User, 'id' | 'username' | 'full_name' | 'avatar_url'>
  replies?: CommentWithUser[]
}

export interface UserProfile extends User {
  _count?: {
    groups: number
    followers: number
    following: number
  }
  isFollowing?: boolean
}

// Settings and stats type definitions
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

export interface GroupSettings {
  allow_comments: boolean
  display_style: 'grid' | 'list'
}

export interface TabMetadata {
  og_title?: string
  og_description?: string
  og_image?: string
  site_name?: string
  reading_time?: number
  word_count?: number
}

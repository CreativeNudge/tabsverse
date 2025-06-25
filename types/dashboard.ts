// TypeScript configuration for strict type checking
// This prevents runtime errors by catching type issues at build time

import type { Database } from './database'

// Use the database enum for categories
export type CollectionCategory = Database['public']['Enums']['collection_category']

export interface CollectionData {
  id: string
  title: string
  description: string
  primary_category: CollectionCategory
  secondary_category?: CollectionCategory | null
  coverImage: string
  itemCount: number
  likes: number
  views: number
  comments: number
  lastUpdated: string
  tags: string[]
  primaryIcon: any // Lucide icon component
  secondaryIcon?: any // Lucide icon component for secondary category
  gradient: string
}

export interface UserStats {
  totalTabs: number
  collections: number
  totalViews: number
}

export interface RecentGroup {
  id: string
  name: string
  primary_category: CollectionCategory
  secondary_category?: CollectionCategory | null
  tabCount: number
  likes: number
  views: number
  comments: number
  lastAccessed: string
  gradient: string
  color: string
  trending: boolean
}

// Component prop types
export interface DashboardPageProps {
  // Add props when needed
}

export interface ModalState {
  showCreateModal: boolean
  createLoading: boolean
}

export interface SidebarState {
  activeSection: string
  expandedSidebar: string | null
}

export interface ViewState {
  viewMode: 'magazine' | 'grid' | 'masonry'
}

// Form types
export interface CreateCurationFormData {
  title: string
  description?: string
  visibility: 'private' | 'public'
  tags: string[]
  coverImage?: string
  primary_category: CollectionCategory
  secondary_category?: CollectionCategory | null
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasMore: boolean
  nextCursor?: string
}

// Category information for UI
export interface CategoryInfo {
  value: CollectionCategory
  label: string
  description: string
  icon: any // Lucide icon component
  color: string
  gradient: string
  keywords: string[]
}

// Legacy support - will be removed in future versions
export type PersonalityType = 'creative' | 'ambitious' | 'wanderlust' | 'technical' | 'artistic' | 'mindful'
export interface PersonalityStyles {
  titleFont: string
  cardStyle: string
  textColor: string
  border: string
}
export type PersonalityStylesMap = Record<PersonalityType, PersonalityStyles>
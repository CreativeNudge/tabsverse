// TypeScript configuration for strict type checking
// This prevents runtime errors by catching type issues at build time

export type PersonalityType = 'creative' | 'ambitious' | 'wanderlust' | 'technical' | 'artistic' | 'mindful'

export interface PersonalityStyles {
  titleFont: string
  cardStyle: string
  textColor: string
  border: string
}

export type PersonalityStylesMap = Record<PersonalityType, PersonalityStyles>

export interface CollectionData {
  id: number
  title: string
  description: string
  personality: PersonalityType
  coverImage: string
  itemCount: number
  likes: number
  views: number
  comments: number
  lastUpdated: string
  tags: string[]
  mood: string
  icon: any // Lucide icon component
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
  category: string
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
  personality: PersonalityType
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

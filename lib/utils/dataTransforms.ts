import { BookOpen, Palette, Compass, Code, Brush, Heart } from 'lucide-react'
import type { PersonalityType, CollectionData } from '@/types/dashboard'
import type { Database } from '@/types/database'

// Database types
type Group = Database['public']['Tables']['groups']['Row']
interface GroupWithUser extends Group {
  user: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
}

// Utility functions for data transformation
export const getPersonalityIcon = (personality: PersonalityType) => {
  const iconMap = {
    creative: Palette,
    ambitious: BookOpen,
    wanderlust: Compass,
    technical: Code,
    artistic: Brush,
    mindful: Heart,
  }
  return iconMap[personality] || Palette
}

export const getPersonalityGradient = (personality: PersonalityType) => {
  const gradientMap = {
    creative: 'from-purple-500/20 to-pink-500/20',
    ambitious: 'from-blue-500/20 to-indigo-500/20',
    wanderlust: 'from-orange-500/20 to-red-500/20',
    technical: 'from-green-500/20 to-teal-500/20',
    artistic: 'from-gray-500/20 to-slate-500/20',
    mindful: 'from-indigo-500/20 to-purple-500/20',
  }
  return gradientMap[personality] || gradientMap.creative
}

export const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

// Main transformation function
export const transformGroupToCollection = (group: GroupWithUser): CollectionData => {
  const personality = (group.settings as any)?.personality as PersonalityType || 'creative'
  
  return {
    id: group.id.length > 10 ? group.id.slice(0, 8) : group.id, // Ensure reasonable ID length
    title: group.title,
    description: group.description || 'No description provided',
    personality,
    coverImage: group.cover_image_url || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    itemCount: group.tab_count || 0,
    likes: group.like_count || 0,
    views: group.view_count || 0,
    comments: group.comment_count || 0,
    lastUpdated: formatLastUpdated(group.updated_at),
    tags: Array.isArray(group.tags) ? group.tags : [],
    mood: personality, // For backward compatibility
    icon: getPersonalityIcon(personality),
    gradient: getPersonalityGradient(personality),
  }
}

// Batch transformation
export const transformGroupsToCollections = (groups: GroupWithUser[]): CollectionData[] => {
  return groups.map(transformGroupToCollection)
}

// Validation function
export const validateCollectionData = (data: any): data is CollectionData => {
  return (
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.personality === 'string' &&
    typeof data.coverImage === 'string' &&
    typeof data.itemCount === 'number' &&
    typeof data.likes === 'number' &&
    typeof data.views === 'number' &&
    typeof data.comments === 'number' &&
    typeof data.lastUpdated === 'string' &&
    Array.isArray(data.tags) &&
    typeof data.mood === 'string' &&
    typeof data.gradient === 'string'
  )
}
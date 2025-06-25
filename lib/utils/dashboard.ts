import { Palette } from 'lucide-react'
import type { Group } from '@/types/database'
import type { CollectionData } from '@/components/curations/CollectionGrid'

/**
 * Transform database groups/curations into UI-friendly collection data
 */
export function transformCurationsToCollections(curations: Group[]): CollectionData[] {
  return curations.map(curation => ({
    id: curation.id,
    title: curation.title,
    description: curation.description || 'No description provided',
    personality: (curation.settings as any)?.personality || 'creative',
    coverImage: curation.cover_image_url || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    itemCount: curation.tab_count,
    likes: curation.like_count,
    views: curation.view_count,
    comments: curation.comment_count,
    lastUpdated: new Date(curation.updated_at).toLocaleDateString(),
    tags: curation.tags || [],
    mood: 'professional-creative',
    icon: Palette, // TODO: Dynamic icons based on personality
    gradient: 'from-purple-400 via-pink-400 to-red-400' // TODO: Dynamic gradients
  }))
}

/**
 * Calculate dashboard statistics from curations
 */
export function calculateDashboardStats(curations: Group[]) {
  return {
    linksCurated: curations.reduce((total, curation) => total + curation.tab_count, 0),
    collectionsCount: curations.length,
    totalViews: curations.reduce((total, curation) => total + curation.view_count, 0)
  }
}

/**
 * Get user initials for avatar display
 */
export function getUserInitials(name: string): string {
  if (!name || name.trim() === '') return 'U'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

import type { Database } from '@/types/database'

// Use the database types
type Group = Database['public']['Tables']['groups']['Row']

/**
 * Calculate dashboard statistics from curations
 */
export function calculateDashboardStats(curations: Group[]) {
  return {
    linksCurated: curations.reduce((total, curation) => total + (curation.tab_count || 0), 0),
    collectionsCount: curations.length,
    totalViews: curations.reduce((total, curation) => total + (curation.view_count || 0), 0)
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

// Note: transformCurationsToCollections has been moved to dataTransforms.ts
// Use transformGroupsToCollections from there instead
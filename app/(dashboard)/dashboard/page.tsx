'use client'

import { Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useGroups } from '@/lib/hooks/useGroups'
import { transformGroupsToCollections } from '@/lib/utils/dataTransforms'

// Page-specific components
import DashboardStats from '@/components/dashboard/DashboardStats'
import CollectionGrid from '@/components/curations/CollectionGrid'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: groups = [], isLoading: groupsLoading, error: groupsError } = useGroups()

  // Transform data for UI (production-level transformation)
  // Only show real data, no mock data fallback for authenticated users
  const collections = transformGroupsToCollections(groups)

  // Calculate dashboard stats from actual data
  const dashboardStats = {
    linksCurated: groups.reduce((sum, g) => sum + (g.tab_count || 0), 0),
    curationsCount: groups.length,
    totalViews: groups.reduce((sum, g) => sum + (g.view_count || 0), 0)
  }

  return (
    <>
      {/* Welcome Section - Page Specific */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-serif text-stone-800 leading-tight">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Creator'}
          </h1>
          <Sparkles className="w-8 h-8 text-orange-400 animate-pulse" />
        </div>
        
        <DashboardStats 
          linksCurated={dashboardStats.linksCurated}
          curationsCount={dashboardStats.curationsCount}
          totalViews={dashboardStats.totalViews}
        />
      </div>

      {/* Curations Gallery - Page Specific */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif text-stone-800">Your Curations</h2>
        </div>
        
        {groupsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-stone-600">Loading curations...</p>
          </div>
        ) : groupsError ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load curations</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
            >
              Retry
            </button>
          </div>
        ) : (
          <CollectionGrid collections={collections} />
        )}
      </div>
    </>
  )
}
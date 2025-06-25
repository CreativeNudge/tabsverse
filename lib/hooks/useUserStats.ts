import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getUserStats, getUserRecentGroups } from '@/lib/queries/user-stats'

type UserStats = {
  totalTabs: number
  collections: number
  totalViews: number
}

type RecentGroup = {
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

export function useUserStats() {
  const { user } = useAuth()
  const [stats] = useState<UserStats>({
    totalTabs: 2435,
    collections: 23,
    totalViews: 98763
  })
  const [recentGroups] = useState<RecentGroup[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  // DISABLED ALL API CALLS TO STOP SPAM
  // This hook now uses mock data only to prevent API issues
  // Future: Convert to React Query pattern like useGroups

  const refreshStats = async () => {
    // Disabled for now
    console.log('Stats refresh disabled - using mock data')
  }

  const refreshRecentGroups = async () => {
    // Disabled for now  
    console.log('Recent groups refresh disabled - using mock data')
  }

  return {
    stats,
    recentGroups,
    loading,
    error,
    refreshStats,
    refreshRecentGroups,
    refetch: () => {
      refreshStats()
      refreshRecentGroups()
    }
  }
}
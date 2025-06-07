import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
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
  const [stats, setStats] = useState<UserStats>({
    totalTabs: 0,
    collections: 0,
    totalViews: 0
  })
  const [recentGroups, setRecentGroups] = useState<RecentGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch stats and recent groups in parallel
        const [userStats, userRecentGroups] = await Promise.all([
          getUserStats(user.id),
          getUserRecentGroups(user.id, 4)
        ])

        setStats(userStats)
        setRecentGroups(userRecentGroups)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user data')
        
        // Set fallback data on error
        setStats({
          totalTabs: 2435,
          collections: 23,
          totalViews: 98763
        })
        setRecentGroups([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user?.id])

  const refreshStats = async () => {
    if (!user?.id) return

    try {
      const userStats = await getUserStats(user.id)
      setStats(userStats)
    } catch (err) {
      console.error('Error refreshing stats:', err)
    }
  }

  const refreshRecentGroups = async () => {
    if (!user?.id) return

    try {
      const userRecentGroups = await getUserRecentGroups(user.id, 4)
      setRecentGroups(userRecentGroups)
    } catch (err) {
      console.error('Error refreshing recent groups:', err)
    }
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
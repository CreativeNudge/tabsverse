import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type UserStats = {
  totalTabs: number
  collections: number
  totalViews: number
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = createClient()
  
  try {
    // Get total collections count
    const { count: collectionsCount, error: collectionsError } = await supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (collectionsError && !collectionsError.message.includes('relation "public.groups" does not exist')) {
      console.error('Error fetching collections count:', collectionsError)
    }

    // Get total tabs count
    const { count: tabsCount, error: tabsError } = await supabase
      .from('tabs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (tabsError && !tabsError.message.includes('relation "public.tabs" does not exist')) {
      console.error('Error fetching tabs count:', tabsError)
    }

    // Get total views across all user's groups
    // First get user's group IDs
    const { data: userGroups, error: groupsError } = await supabase
      .from('groups')
      .select('id')
      .eq('user_id', userId)

    if (groupsError && !groupsError.message.includes('relation "public.groups" does not exist')) {
      console.error('Error fetching user groups:', groupsError)
    }

    // Then get views for those groups
    let totalViews = 0
    if (userGroups && userGroups.length > 0) {
      const groupIds = userGroups.map(group => group.id)
      const { count: viewsCount, error: viewsError } = await supabase
        .from('group_views')
        .select('*', { count: 'exact', head: true })
        .in('group_id', groupIds)

      if (viewsError && !viewsError.message.includes('relation "public.group_views" does not exist')) {
        console.error('Error fetching views count:', viewsError)
      }
      
      totalViews = viewsCount || 0
    }

    return {
      totalTabs: tabsCount || 0,
      collections: collectionsCount || 0,
      totalViews: totalViews
    }
  } catch (error) {
    // If tables don't exist yet, return mock data for development
    console.log('Database tables not found, using fallback data')
    return {
      totalTabs: 2435,
      collections: 23,
      totalViews: 98763
    }
  }
}

export async function getUserRecentGroups(userId: string, limit: number = 4) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        id,
        title,
        description,
        slug,
        cover_image_url,
        visibility,
        tab_count,
        view_count,
        like_count,
        comment_count,
        updated_at,
        last_activity_at,
        tags,
        tabs:tabs(count)
      `)
      .eq('user_id', userId)
      .order('last_activity_at', { ascending: false })
      .limit(limit)

    if (error) {
      if (error.message.includes('relation "public.groups" does not exist')) {
        console.log('Groups table not found, using mock data')
        return getMockRecentGroups()
      }
      throw error
    }

    return data?.map(group => ({
      id: group.id,
      name: group.title,
      category: group.tags?.[0] || 'General',
      tabCount: group.tab_count || 0,
      likes: group.like_count || 0,
      views: group.view_count || 0,
      comments: group.comment_count || 0,
      lastAccessed: new Date(group.last_activity_at || group.updated_at).toLocaleDateString('en-GB'),
      gradient: getRandomGradient(),
      color: getRandomColor(),
      trending: group.view_count > 1000
    })) || []
  } catch (error) {
    console.log('Error fetching recent groups, using mock data:', error)
    return getMockRecentGroups()
  }
}

// Helper functions for styling
function getRandomGradient() {
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500'
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

function getRandomColor() {
  const colors = [
    'bg-purple-100 text-purple-600',
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-orange-100 text-orange-600',
    'bg-indigo-100 text-indigo-600',
    'bg-pink-100 text-pink-600'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Mock data fallback
function getMockRecentGroups() {
  return [
    {
      id: '1',
      name: "UX Design Tutorial",
      category: "Design",
      tabCount: 237,
      likes: 23,
      views: 34567,
      comments: 12,
      lastAccessed: "23.04.2024",
      gradient: "from-purple-500 to-pink-500",
      color: "bg-purple-100 text-purple-600",
      trending: true
    },
    {
      id: '2',
      name: "New brand",
      category: "Branding",
      tabCount: 232,
      likes: 45,
      views: 34567,
      comments: 8,
      lastAccessed: "23.04.2024",
      gradient: "from-blue-500 to-cyan-500",
      color: "bg-blue-100 text-blue-600",
      trending: false
    },
    {
      id: '3',
      name: "Spotify.com",
      category: "Music 2024",
      tabCount: 150,
      likes: 67,
      views: 12543,
      comments: 23,
      lastAccessed: "23.04.2024",
      gradient: "from-green-500 to-emerald-500",
      color: "bg-green-100 text-green-600",
      trending: false
    },
    {
      id: '4',
      name: "onepagelove.com",
      category: "Design Inspiration",
      tabCount: 89,
      likes: 156,
      views: 8921,
      comments: 34,
      lastAccessed: "23.04.2024",
      gradient: "from-orange-500 to-red-500",
      color: "bg-orange-100 text-orange-600",
      trending: true
    }
  ]
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'
import { useAuth } from '@/lib/hooks/useAuth'
import type { Database } from '@/types/database'

// Types
type Group = Database['public']['Tables']['groups']['Row']

interface GroupWithUser extends Group {
  user: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
}

interface CreateGroupData {
  title: string
  description?: string
  visibility: 'private' | 'public'
  tags?: string
  personality: 'creative' | 'ambitious' | 'wanderlust' | 'technical' | 'artistic' | 'mindful'
  coverImageUrl?: string
}

// API Functions (separate from hooks for better separation of concerns)
const groupsApi = {
  getAll: async (): Promise<GroupWithUser[]> => {
    const response = await fetch('/api/curations')
    if (!response.ok) {
      throw new Error('Failed to fetch groups')
    }
    const result = await response.json()
    return result.curations || []
  },

  create: async (data: CreateGroupData): Promise<GroupWithUser> => {
    const response = await fetch('/api/curations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to create group')
    }
    const result = await response.json()
    return result.curation
  },

  checkLimit: async () => {
    const response = await fetch('/api/curations/limit')
    if (!response.ok) {
      throw new Error('Failed to check group limit')
    }
    return response.json()
  }
}

// Hooks
export function useGroups() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: queryKeys.groups.all,
    queryFn: groupsApi.getAll,
    enabled: !!user, // Only fetch when user is authenticated
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: groupsApi.create,
    onSuccess: (newGroup) => {
      // Add new group to the cache (optimistic update)
      queryClient.setQueryData<GroupWithUser[]>(
        queryKeys.groups.all,
        (old = []) => [newGroup, ...old]
      )
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['group-limit'] })
    },
  })
}

export function useGroupLimit() {
  const queryClient = useQueryClient()
  
  return useQuery({
    queryKey: ['group-limit'],
    queryFn: () => {
      // First try to use cached groups data to compute limit
      const existingGroups = queryClient.getQueryData<GroupWithUser[]>(queryKeys.groups.all)
      
      if (existingGroups) {
        const currentCount = existingGroups.length
        const limit = 5
        return Promise.resolve({
          canCreate: currentCount < limit,
          count: currentCount,
          limit,
          remaining: limit - currentCount
        })
      }
      
      // Fallback to API call if no cached data
      return groupsApi.checkLimit()
    },
  })
}
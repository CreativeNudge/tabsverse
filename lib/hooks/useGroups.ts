import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'
import { useAuth } from '@/lib/hooks/useAuth'
import type { Database } from '@/types/database'

// Types
type Group = Database['public']['Tables']['groups']['Row']
type Tab = Database['public']['Tables']['tabs']['Row']

interface GroupWithUser extends Group {
  user: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
}

interface GroupWithTabs extends GroupWithUser {
  tabs: Tab[]
  isLiked?: boolean
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

  getById: async (id: string): Promise<GroupWithTabs> => {
    const response = await fetch(`/api/curations/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch curation')
    }
    const result = await response.json()
    return result.curation
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

  update: async (id: string, data: Partial<CreateGroupData>): Promise<GroupWithUser> => {
    const response = await fetch(`/api/curations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to update curation')
    }
    const result = await response.json()
    return result.curation
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/curations/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to delete curation')
    }
  },

  like: async (id: string): Promise<void> => {
    const response = await fetch(`/api/curations/${id}/like`, {
      method: 'POST',
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to like curation')
    }
  },

  unlike: async (id: string): Promise<void> => {
    const response = await fetch(`/api/curations/${id}/like`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to unlike curation')
    }
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

export function useGroup(id: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: () => groupsApi.getById(id),
    enabled: !!user && !!id,
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGroupData> }) => 
      groupsApi.update(id, data),
    onSuccess: (updatedGroup, variables) => {
      // Update cache for individual group
      queryClient.setQueryData(
        queryKeys.groups.detail(variables.id),
        (old: GroupWithTabs | undefined) => {
          if (!old) return updatedGroup as GroupWithTabs
          return { ...old, ...updatedGroup }
        }
      )
      
      // Update cache for groups list
      queryClient.setQueryData<GroupWithUser[]>(
        queryKeys.groups.all,
        (old = []) => old.map(group => 
          group.id === variables.id ? { ...group, ...updatedGroup } : group
        )
      )
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: groupsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.groups.detail(deletedId) })
      queryClient.setQueryData<GroupWithUser[]>(
        queryKeys.groups.all,
        (old = []) => old.filter(group => group.id !== deletedId)
      )
    },
  })
}

export function useLikeGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: groupsApi.like,
    onSuccess: (_, groupId) => {
      // Update like status and count
      queryClient.setQueryData(
        queryKeys.groups.detail(groupId),
        (old: GroupWithTabs | undefined) => {
          if (!old) return old
          return {
            ...old,
            isLiked: true,
            like_count: old.like_count + 1
          }
        }
      )
    },
  })
}

export function useUnlikeGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: groupsApi.unlike,
    onSuccess: (_, groupId) => {
      // Update like status and count
      queryClient.setQueryData(
        queryKeys.groups.detail(groupId),
        (old: GroupWithTabs | undefined) => {
          if (!old) return old
          return {
            ...old,
            isLiked: false,
            like_count: Math.max(0, old.like_count - 1)
          }
        }
      )
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
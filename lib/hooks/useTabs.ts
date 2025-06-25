import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'
import type { Database } from '@/types/database'

// Types
type Tab = Database['public']['Tables']['tabs']['Row']
type GroupWithTabs = {
  tabs: Tab[]
  id: string
  tab_count: number
}

interface CreateTabData {
  url: string
  title: string
  description?: string
  resource_type: string
  tags: string[]
  notes?: string
  thumbnail_url?: string
  favicon_url?: string
}

// API Functions
const tabsApi = {
  create: async (groupId: string, data: CreateTabData): Promise<Tab> => {
    const response = await fetch(`/api/curations/${groupId}/tabs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to create tab')
    }
    const result = await response.json()
    return result.tab
  },

  update: async (tabId: string, data: Partial<CreateTabData>): Promise<Tab> => {
    const response = await fetch(`/api/tabs/${tabId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to update tab')
    }
    const result = await response.json()
    return result.tab
  },

  delete: async (tabId: string): Promise<void> => {
    const response = await fetch(`/api/tabs/${tabId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to delete tab')
    }
  },

  click: async (tabId: string): Promise<void> => {
    // Track click analytics (fire and forget)
    fetch(`/api/tabs/${tabId}/click`, { method: 'POST' }).catch(() => {
      // Ignore analytics errors
    })
  }
}

// Hooks
export function useCreateTab(groupId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTabData) => tabsApi.create(groupId, data),
    onSuccess: (newTab) => {
      // Add new tab to the cached group data
      queryClient.setQueryData(
        queryKeys.groups.detail(groupId),
        (old: GroupWithTabs | undefined) => {
          if (!old) return old
          return {
            ...old,
            tabs: [...(old.tabs || []), newTab].sort((a, b) => a.position - b.position),
            tab_count: old.tab_count + 1
          }
        }
      )
      
      // Invalidate groups list to update counts
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all })
    },
  })
}

export function useUpdateTab() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ tabId, data }: { tabId: string; data: Partial<CreateTabData> }) => 
      tabsApi.update(tabId, data),
    onSuccess: (updatedTab) => {
      // Update tab in any cached group data
      queryClient.setQueriesData(
        { queryKey: queryKeys.groups.all },
        (old: GroupWithTabs | undefined) => {
          if (!old || !old.tabs) return old
          return {
            ...old,
            tabs: old.tabs.map(tab => 
              tab.id === updatedTab.id ? { ...tab, ...updatedTab } : tab
            )
          }
        }
      )
    },
  })
}

export function useDeleteTab() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: tabsApi.delete,
    onSuccess: (_, deletedTabId) => {
      // Remove tab from any cached group data
      queryClient.setQueriesData(
        { queryKey: queryKeys.groups.all },
        (old: GroupWithTabs | undefined) => {
          if (!old || !old.tabs) return old
          return {
            ...old,
            tabs: old.tabs.filter(tab => tab.id !== deletedTabId),
            tab_count: Math.max(0, old.tab_count - 1)
          }
        }
      )
      
      // Invalidate groups list to update counts
      queryClient.invalidateQueries({ queryKey: queryKeys.groups.all })
    },
  })
}

export function useTrackTabClick() {
  return useMutation({
    mutationFn: tabsApi.click,
    // No cache updates needed for analytics
  })
}

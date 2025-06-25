'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

// Query key factory (same pattern as Mail Collectly)
export const queryKeys = {
  groups: {
    all: ['groups'] as const,
    detail: (id: string) => ['groups', id] as const,
    byUser: (userId: string) => ['groups', 'user', userId] as const,
  },
  tabs: {
    all: ['tabs'] as const,
    byGroup: (groupId: string) => ['tabs', 'group', groupId] as const,
  },
  user: {
    profile: ['user', 'profile'] as const,
    stats: ['user', 'stats'] as const,
  },
}

// Error handling (same as Mail Collectly)
export const handleQueryError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// React Query Provider Component
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // Create a client instance that persists across re-renders
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 1,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 1,
        },
      },
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
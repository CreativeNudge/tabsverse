'use client'

import { SafeAuthProvider, useAuth } from '@/lib/auth/safe-context'

function AuthTestDisplay() {
  const { user, loading } = useAuth()
  
  console.log('🧪 AuthTestDisplay render:', { hasUser: !!user, loading })
  
  return (
    <div className="fixed bottom-4 right-4 bg-green-900 text-white p-4 rounded-lg text-sm z-50 max-w-xs">
      <div className="font-bold mb-2">🧪 Auth Test</div>
      <div>Loading: {loading ? '⏳' : '✅'}</div>
      <div>User: {user ? '👤 Logged in' : '🚫 Not logged in'}</div>
      <div className="text-xs text-green-300 mt-2">
        Safe AuthProvider Test - Check console for logs
      </div>
    </div>
  )
}

export default function SafeAuthTest() {
  console.log('🧪 SafeAuthTest component mounting')
  
  return (
    <SafeAuthProvider>
      <AuthTestDisplay />
    </SafeAuthProvider>
  )
}

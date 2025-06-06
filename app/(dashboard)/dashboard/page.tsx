'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/')
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-neutral-200 rounded-lg h-96 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-inter">
            Welcome to Tabsverse! 🎉
          </h2>
          
          {profile && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-2">Your Profile</h3>
              <p className="text-neutral-600">Name: {profile.full_name || 'Not set'}</p>
              <p className="text-neutral-600">Email: {profile.email}</p>
              <p className="text-neutral-600">Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
              <p className="text-neutral-600">Subscription: {profile.subscription_tier}</p>
            </div>
          )}

          <p className="text-neutral-600 mb-6">
            Your authentication system is working perfectly! 
            <br />
            This is your protected dashboard area.
          </p>
          
          <div className="space-y-4">
            <div className="bg-brand-blue/10 p-4 rounded-lg">
              <p className="text-sm text-brand-blue font-medium">
                🚀 Next Steps: Start building collections and resource management features
              </p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Search, RefreshCw, Bell } from 'lucide-react'
import Image from 'next/image'

interface User {
  full_name?: string | null
  avatar_url?: string | null
  email?: string | null
}

interface DashboardHeaderProps {
  profile: User | null
  onRefresh: () => void
}

function getUserInitials(name: string): string {
  if (!name || name.trim() === '') return 'U'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function DashboardHeader({ profile, onRefresh }: DashboardHeaderProps) {
  return (
    <div className="h-20 bg-white/70 backdrop-blur-xl border-b border-orange-100/50 flex items-center justify-between px-8 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Find your curated collections..."
            className="w-full pl-12 pr-6 py-4 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white/80 backdrop-blur-sm transition-all text-stone-700 placeholder-stone-400"
          />
        </div>
      </div>
      
      {/* Right actions */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onRefresh}
          className="p-3 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-300 hover:scale-110"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        
        <button className="p-3 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-300 hover:scale-110 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#af0946] to-[#dc8c35] rounded-full animate-pulse shadow-lg"></span>
        </button>
        
        {/* User avatar */}
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || 'User'}
              width={48}
              height={48}
              className="w-12 h-12 rounded-2xl ring-2 ring-orange-200 hover:ring-orange-300 transition-all cursor-pointer object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-[#af0946] to-[#dc8c35] rounded-2xl flex items-center justify-center ring-2 ring-orange-200 hover:ring-orange-300 transition-all cursor-pointer shadow-lg">
              <span className="text-white font-semibold text-lg">
                {profile?.full_name ? getUserInitials(profile.full_name) : profile?.email ? profile.email[0].toUpperCase() : 'U'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

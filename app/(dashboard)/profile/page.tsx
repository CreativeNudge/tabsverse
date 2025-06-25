'use client'

import { User, Eye, Heart, Share2, Edit3, Calendar } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useGroups } from '@/lib/hooks/useGroups'
import { transformGroupsToCollections } from '@/lib/utils/dataTransforms'
import CollectionGrid from '@/components/curations/CollectionGrid'

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: groups = [], isLoading: groupsLoading } = useGroups()
  
  // Calculate profile stats
  const profileStats = {
    totalCurations: groups.length,
    totalViews: groups.reduce((sum, g) => sum + (g.view_count || 0), 0),
    totalLikes: groups.reduce((sum, g) => sum + (g.like_count || 0), 0),
    linksCurated: groups.reduce((sum, g) => sum + (g.tab_count || 0), 0)
  }

  const collections = transformGroupsToCollections(groups)

  return (
    <>
      {/* Profile Header */}
      <div className="mb-12">
        <div className="flex items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-lg">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full rounded-3xl object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
              <Edit3 className="w-4 h-4 text-stone-600" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-serif text-stone-800 leading-tight">
                {user?.user_metadata?.full_name || 'Your Profile'}
              </h1>
              <Calendar className="w-6 h-6 text-stone-400" />
              <span className="text-stone-500 text-sm">
                Member since {new Date().getFullYear()}
              </span>
            </div>
            
            <p className="text-stone-600 text-lg leading-relaxed mb-6 max-w-2xl">
              Welcome to your personal curation space. Here you can manage all your collections, 
              track your progress, and see how your curated content is performing.
            </p>

            {/* Quick Stats */}
            <div className="flex gap-6">
              {[
                { label: 'Curations', value: profileStats.totalCurations, icon: User },
                { label: 'Total Views', value: profileStats.totalViews.toLocaleString(), icon: Eye },
                { label: 'Total Likes', value: profileStats.totalLikes, icon: Heart },
                { label: 'Links Curated', value: profileStats.linksCurated, icon: Share2 },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-orange-500" />
                    <span className="text-2xl font-bold text-stone-800">{stat.value}</span>
                  </div>
                  <span className="text-stone-500 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex gap-2">
          {['All Curations', 'Public', 'Private', 'Most Viewed', 'Recent'].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                filter === 'All Curations'
                  ? 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] text-white shadow-lg'
                  : 'bg-white/60 text-stone-600 hover:bg-white/80 border border-stone-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Curations Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif text-stone-800">Your Curations</h2>
          <span className="text-stone-500">
            {groups.length} {groups.length === 1 ? 'curation' : 'curations'}
          </span>
        </div>
        
        {groupsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-stone-600">Loading your curations...</p>
          </div>
        ) : (
          <CollectionGrid collections={collections} />
        )}
      </div>
    </>
  )
}

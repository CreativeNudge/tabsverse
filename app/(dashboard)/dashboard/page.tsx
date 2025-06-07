'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from '@/components/Logo'
import { useUserStats } from '@/lib/hooks/useUserStats'
import { 
  Home,
  User, 
  Users, 
  Globe, 
  Settings, 
  LogOut,
  Search,
  RefreshCw,
  Bell,
  Plus,
  Heart,
  Eye,
  MessageCircle,
  ExternalLink,
  Clock,
  Sparkles,
  BookOpen,
  Coffee,
  Palette,
  Code,
  MapPin,
  Music,
  Camera,
  Briefcase
} from 'lucide-react'

// Enhanced mock collections with personality and visual richness
const mockEnhancedCollections = [
  {
    id: 1,
    title: "Design System Goldmine",
    description: "The most beautiful design systems from Apple, Stripe, and emerging startups",
    personality: "creative",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    itemCount: 47,
    likes: 234,
    views: 8947,
    comments: 23,
    lastUpdated: "2 hours ago",
    tags: ["Design", "UI/UX", "Systems"],
    mood: "professional-creative",
    icon: Palette,
    gradient: "from-purple-400 via-pink-400 to-red-400"
  },
  {
    id: 2,
    title: "Startup Founder's Toolkit",
    description: "Everything I wish I knew before starting my company - legal, finance, growth",
    personality: "ambitious",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
    itemCount: 89,
    likes: 567,
    views: 15432,
    comments: 45,
    lastUpdated: "1 day ago",
    tags: ["Business", "Startup", "Tools"],
    mood: "serious-focused",
    icon: Briefcase,
    gradient: "from-blue-500 via-blue-600 to-indigo-700"
  },
  {
    id: 3,
    title: "Tokyo Coffee Culture",
    description: "Hidden gems and aesthetic cafes discovered during my month in Shibuya",
    personality: "wanderlust",
    coverImage: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=250&fit=crop",
    itemCount: 23,
    likes: 892,
    views: 12043,
    comments: 67,
    lastUpdated: "3 days ago",
    tags: ["Travel", "Coffee", "Japan"],
    mood: "warm-nostalgic",
    icon: Coffee,
    gradient: "from-amber-400 via-orange-400 to-red-500"
  },
  {
    id: 4,
    title: "Next.js Deep Dive",
    description: "Advanced patterns, performance tricks, and undocumented features",
    personality: "technical",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
    itemCount: 34,
    likes: 445,
    views: 9876,
    comments: 28,
    lastUpdated: "5 hours ago",
    tags: ["Development", "React", "JavaScript"],
    mood: "sharp-focused",
    icon: Code,
    gradient: "from-green-400 via-cyan-400 to-blue-500"
  },
  {
    id: 5,
    title: "Analog Photography",
    description: "Film stocks, vintage cameras, and the art of intentional photography",
    personality: "artistic",
    coverImage: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=250&fit=crop",
    itemCount: 67,
    likes: 723,
    views: 18234,
    comments: 89,
    lastUpdated: "1 week ago",
    tags: ["Photography", "Film", "Art"],
    mood: "vintage-warm",
    icon: Camera,
    gradient: "from-slate-400 via-gray-500 to-zinc-600"
  },
  {
    id: 6,
    title: "Study Music Curation",
    description: "Lo-fi, ambient, and classical pieces that actually help you focus",
    personality: "mindful",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    itemCount: 156,
    likes: 1204,
    views: 34567,
    comments: 234,
    lastUpdated: "12 hours ago",
    tags: ["Music", "Productivity", "Focus"],
    mood: "calm-centered",
    icon: Music,
    gradient: "from-indigo-400 via-purple-400 to-pink-400"
  }
]

// Helper function for personality-based styling
const getPersonalityStyles = (personality: string, mood: string) => {
  const styles = {
    creative: {
      titleFont: 'font-serif',
      cardStyle: 'hover:rotate-1',
      textColor: 'text-purple-900',
      border: 'border-purple-200'
    },
    ambitious: {
      titleFont: 'font-sans font-bold',
      cardStyle: 'hover:scale-105',
      textColor: 'text-blue-900',
      border: 'border-blue-200'
    },
    wanderlust: {
      titleFont: 'font-serif italic',
      cardStyle: 'hover:-translate-y-2',
      textColor: 'text-orange-900',
      border: 'border-orange-200'
    },
    technical: {
      titleFont: 'font-mono font-semibold',
      cardStyle: 'hover:shadow-2xl',
      textColor: 'text-green-900',
      border: 'border-green-200'
    },
    artistic: {
      titleFont: 'font-serif',
      cardStyle: 'hover:sepia hover:scale-105',
      textColor: 'text-gray-800',
      border: 'border-gray-300'
    },
    mindful: {
      titleFont: 'font-light',
      cardStyle: 'hover:shadow-lg',
      textColor: 'text-indigo-900',
      border: 'border-indigo-200'
    }
  }
  
  return styles[personality] || styles.creative
}

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const { stats, recentGroups, loading: statsLoading, error: statsError, refetch } = useUserStats()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('home')
  const [expandedSidebar, setExpandedSidebar] = useState(null)
  const [viewMode, setViewMode] = useState('magazine') // magazine, grid, masonry
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/')
    }
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name || name.trim() === '') return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'personal', icon: User, label: 'Personal' },
    { id: 'shared', icon: Users, label: 'Shared' },
    { id: 'community', icon: Globe, label: 'Community' }
  ]

  const handleSidebarClick = (itemId: string) => {
    setActiveSection(itemId)
    if (itemId === 'home') {
      setExpandedSidebar(null)
    } else {
      setExpandedSidebar(itemId)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-conic from-orange-100/10 via-amber-100/10 to-yellow-100/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Luxurious Minimal Sidebar */}
      <div className="relative w-20 bg-white/80 backdrop-blur-xl flex flex-col items-center py-6 space-y-6 shadow-xl border-r border-orange-100/50">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 via-transparent to-amber-50/30"></div>
        
        {/* Logo with breathing space */}
        <div className="relative z-10 p-2">
          <Logo variant="icon" size="lg" />
        </div>
        
        {/* Elegant divider */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
        
        {/* Navigation Icons - Luxurious spacing */}
        <div className="space-y-6 relative z-10">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.id)}
              className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                activeSection === item.id
                  ? 'bg-gradient-to-br from-[#af0946] to-[#dc8c35] text-white shadow-lg shadow-orange-200 scale-110'
                  : 'text-stone-600 hover:text-orange-600 hover:bg-orange-50 hover:scale-105'
              }`}
            >
              {/* Soft glow for active */}
              {activeSection === item.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#af0946] to-[#dc8c35] rounded-2xl blur opacity-30 -z-10 animate-pulse"></div>
              )}
              <item.icon className="w-6 h-6 relative z-10" />
              
              {/* Luxury tooltip */}
              <div className="absolute left-20 px-4 py-2 bg-stone-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-30 shadow-2xl">
                {item.label}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-stone-800 rotate-45"></div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex-1"></div>
        
        {/* Bottom actions with luxury spacing */}
        <div className="space-y-6 relative z-10">
          <button className="group relative w-14 h-14 rounded-2xl flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-orange-50 hover:scale-105 transition-all duration-500">
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={handleSignOut}
            className="group relative w-14 h-14 rounded-2xl flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-red-50 hover:scale-105 transition-all duration-500"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Elegant Header */}
        <div className="h-20 bg-white/70 backdrop-blur-xl border-b border-orange-100/50 flex items-center justify-between px-8 shadow-sm">
          {/* Search with personality */}
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
          
          {/* Right actions with breathing room */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                console.log('Refreshing collections...')
                // For now, just a visual refresh since we don't have real data yet
                window.location.reload()
              }}
              className="p-3 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-3 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-300 hover:scale-110 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#af0946] to-[#dc8c35] rounded-full animate-pulse shadow-lg"></span>
            </button>
            
            {/* User avatar with luxury feel */}
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
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

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="group relative w-16 h-16 bg-gradient-to-br from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#af0946] to-[#dc8c35] group-hover:from-[#31a9d6] group-hover:to-[#000d85] rounded-full blur opacity-40 -z-10 animate-pulse"></div>
            
            <Plus className="w-8 h-8 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            
            {/* Tooltip */}
            <div className="absolute bottom-20 right-0 px-4 py-2 bg-stone-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-2xl">
              Create New Curation
              <div className="absolute bottom-0 right-6 transform translate-y-1 w-2 h-2 bg-stone-800 rotate-45"></div>
            </div>
          </button>
        </div>

        {/* Create Curation Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-stone-50 to-amber-50/30 px-8 py-6 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-800">Create New Curation</h2>
                    <p className="text-stone-600 mt-1">Start curating your digital discoveries</p>
                  </div>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5 text-stone-600 rotate-45" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Curation Title*</label>
                  <input
                    type="text"
                    placeholder="e.g., Design System Goldmine, Tokyo Coffee Culture"
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 text-lg"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Description (optional)</label>
                  <textarea
                    placeholder="What makes this curation special? What will people discover?"
                    rows={3}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 resize-none"
                  />
                </div>

                {/* Quick Setup Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Visibility Toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Visibility</label>
                    <div className="flex bg-stone-100 rounded-2xl p-1">
                      <button className="flex-1 px-4 py-2 rounded-xl bg-white shadow-sm text-stone-700 font-medium transition-all">
                        🔒 Private
                      </button>
                      <button className="flex-1 px-4 py-2 rounded-xl text-stone-600 hover:text-stone-700 transition-all">
                        🌍 Public
                      </button>
                    </div>
                  </div>

                  {/* Quick Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Quick Tags</label>
                    <input
                      type="text"
                      placeholder="design, tools, inspiration"
                      className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400"
                    />
                  </div>
                </div>

                {/* Cover Image Option */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Cover Image (optional)</label>
                  <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center hover:border-stone-300 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-stone-200 transition-colors">
                      <Camera className="w-6 h-6 text-stone-400" />
                    </div>
                    <p className="text-stone-600 font-medium">Upload a cover image</p>
                    <p className="text-stone-400 text-sm mt-1">Or we'll create a beautiful one automatically</p>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-orange-800 font-medium text-sm">Pro Tip</p>
                      <p className="text-orange-700 text-sm mt-1">
                        You can always edit these details later. The magic happens when you start adding your first links!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex items-center justify-between">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                
                <button 
                  className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${
                    createLoading 
                      ? 'bg-gradient-to-r from-[#31a9d6] to-[#000d85] text-white scale-105' 
                      : 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white hover:scale-105'
                  } shadow-lg hover:shadow-xl`}
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Curation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Magazine-Style Collection Gallery */}
        <div className="flex-1 overflow-auto relative">
          <div className="max-w-7xl mx-auto p-8">
            {/* Welcome Section with Personality */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <h1 className="text-4xl font-serif text-stone-800 leading-tight">
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'Creator'}
                </h1>
                <Sparkles className="w-8 h-8 text-orange-400 animate-pulse" />
              </div>
              
              {/* Quick stats with breathing room */}
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-100/50 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-stone-800 mb-1">
                        {mockEnhancedCollections.length}
                      </div>
                      <div className="text-stone-500 font-medium">Links Curated</div>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-100/50 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-stone-800 mb-1">
                        {mockEnhancedCollections.length}
                      </div>
                      <div className="text-stone-500 font-medium">Collections</div>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-100/50 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-stone-800 mb-1">
                        {mockEnhancedCollections.reduce((total, collection) => total + collection.views, 0).toLocaleString()}
                      </div>
                      <div className="text-stone-500 font-medium">Total Views</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Gallery - Magazine Style */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif text-stone-800">Your Curated Collections</h2>
              </div>
              
              {/* Masonry-style layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockEnhancedCollections.map((collection, index) => {
                  const personalityStyles = getPersonalityStyles(collection.personality, collection.mood)
                  const IconComponent = collection.icon
                  
                  return (
                    <div
                      key={collection.id}
                      className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-stone-200/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20 ${personalityStyles.cardStyle}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Cover Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={collection.coverImage} 
                          alt={collection.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} opacity-60`}></div>
                        
                        {/* Floating icon */}
                        <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                          <IconComponent className={`w-6 h-6 ${personalityStyles.textColor}`} />
                        </div>
                        
                        {/* Quick actions */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:scale-110 transition-transform group/heart">
                            <Heart className="w-5 h-5 text-red-400 group-hover/heart:fill-red-400 transition-all" />
                          </button>
                          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                            <ExternalLink className="w-5 h-5 text-stone-600 group-hover:text-orange-600 transition-colors" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`text-xl ${personalityStyles.titleFont} ${personalityStyles.textColor} leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500`}>
                            {collection.title}
                          </h3>
                        </div>
                        
                        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {collection.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {collection.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                          <div className="flex items-center gap-4 text-sm text-stone-500">
                            <span className="font-medium">{collection.itemCount} items</span>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{collection.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{collection.views.toLocaleString()}</span>
                            </div>
                          </div>
                          <span className="text-xs text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {collection.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
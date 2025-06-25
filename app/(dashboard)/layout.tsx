'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useAuth, signOut } from '@/lib/hooks/useAuth'
import { useCreateGroup, useGroupLimit } from '@/lib/hooks/useGroups'

// Universal Components
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import FloatingActionButton from '@/components/dashboard/FloatingActionButton'
import CreateCurationModal, { type CurationFormData } from '@/components/curations/CreateCurationModal'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  // Universal dashboard state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  
  // Auto-detect active section from pathname
  useEffect(() => {
    const path = pathname.split('/').pop() || 'dashboard'
    
    // Map pathnames to sidebar section IDs
    const sectionMap: { [key: string]: string } = {
      'dashboard': 'home',
      'browse': 'community',
      'profile': 'personal',
      'shared': 'shared',
      'settings': 'settings'
    }
    
    const mappedSection = sectionMap[path] || 'home'
    setActiveSection(mappedSection)
  }, [pathname])
  
  // Universal dashboard hooks
  const createGroupMutation = useCreateGroup()
  const { data: limitInfo } = useGroupLimit()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 flex items-center justify-center relative overflow-hidden">
        {/* Ambient background elements - same as dashboard */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-100/10 via-amber-100/10 to-yellow-100/10 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        {/* Loading content */}
        <div className="relative z-10 text-center">
          {/* Logo with breathing animation - tiny for loading */}
          <div className="mb-4 animate-pulse">
            <Image
              src="/logo/tabsverse-logo-transparent-small.png"
              alt="Tabsverse"
              width={24}
              height={24}
              className="h-6 w-auto mx-auto"
              priority
            />
          </div>
          
          {/* Loading text with gradient */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#af0946] to-[#dc8c35] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#31a9d6] to-[#000d85] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#af0946] to-[#dc8c35] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-stone-600 font-inter font-medium text-sm ml-2">Loading your curations...</span>
          </div>
          
          {/* Subtle tagline */}
          <p className="text-stone-400 text-xs mt-2 font-inter">Transforming digital chaos into curated zen</p>
        </div>
      </div>
    )
  }

  // Authentication redirect
  if (!loading && !user) {
    router.push('/auth/login')
    return null
  }

  if (!user) {
    return null
  }

  // Universal create curation handler
  const createCuration = async (formData: CurationFormData) => {
    try {
      await createGroupMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
        tags: formData.tags,
        primary_category: formData.primary_category,
        secondary_category: formData.secondary_category || null,
        coverImageUrl: formData.coverImageUrl
      })
      
      setShowCreateModal(false)
      console.log('✅ Curation created successfully!')
    } catch (error) {
      console.error('❌ Failed to create curation:', error)
      alert(error instanceof Error ? error.message : 'Failed to create curation')
    }
  }

  const handleSectionChange = (sectionId: string) => {
    // Map sidebar section IDs to routes
    const routeMap: { [key: string]: string } = {
      'home': '/dashboard',
      'community': '/browse',
      'personal': '/profile',
      'shared': '/shared',
      'settings': '/settings'
    }
    
    const route = routeMap[sectionId] || '/dashboard'
    router.push(route)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20">
      {/* Universal Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-100/10 via-amber-100/10 to-yellow-100/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Universal Sidebar */}
      <DashboardSidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Universal Header */}
        <DashboardHeader 
          profile={{
            full_name: user?.user_metadata?.full_name || 'User',
            avatar_url: user?.user_metadata?.avatar_url
          }} 
          onRefresh={() => {/* React Query handles this automatically */}} 
        />
        
        {/* Universal Floating Action Button - only show on non-detail pages */}
        {!pathname.includes('/curations/') && (
          <FloatingActionButton onClick={() => setShowCreateModal(true)} />
        )}

        {/* Universal Create Curation Modal */}
        <CreateCurationModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={createCuration}
          isLoading={createGroupMutation.isPending}
          limitInfo={{ remaining: limitInfo?.remaining || 5 }}
        />

        {/* Page-Specific Content */}
        <div className="flex-1 overflow-auto relative">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
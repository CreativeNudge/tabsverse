'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Logo from '@/components/Logo'
import Image from 'next/image'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

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

  if (!user) {
    return null
  }

  return <>{children}</>
}
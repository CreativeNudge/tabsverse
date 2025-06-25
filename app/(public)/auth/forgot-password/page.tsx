'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) {
      setError(error.message || 'An error occurred while sending reset email')
      setLoading(false)
    } else {
      setSuccess('Check your email for a password reset link!')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand/Visual */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-brand-pink via-brand-orange to-brand-blue">
        {/* Enhanced gradient background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Floating gradient shapes */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Logo */}
        <div className="relative z-10 p-8">
          <div className="flex items-center text-white">
            <Image
              src="/logo/tabsverse-logo-transparent-small.png"
              alt="Tabsverse"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="ml-3 text-2xl font-bold font-inter">tabsverse</span>
          </div>
        </div>

      </div>

      {/* Right Side - Reset Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-inter">Reset Password</h1>
            <p className="text-neutral-600">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link 
              href="/auth/login" 
              className="text-brand-blue hover:text-blue-600 font-medium transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
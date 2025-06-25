'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { signUp } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await signUp(email, password, fullName)
    
    if (error) {
      setError(error.message || 'An error occurred during sign up')
      setLoading(false)
    } else {
      setSuccess('Check your email for a confirmation link!')
      setLoading(false)
      // Optionally redirect to login after a delay
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true)
    setError('')
    
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=/dashboard`,
      },
    })
    
    if (error) {
      setError(error.message || 'An error occurred during social sign up')
      setLoading(false)
    }
    // Note: For social login, redirect happens via the callback URL
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand/Visual */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-brand-pink via-brand-orange to-brand-blue">
        {/* Curved Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Curved gradient shapes similar to Figma */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
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

        {/* Large Logo in Center */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <Image
            src="/logo/logo-login-large-1440px.png"
            alt="Tabsverse Logo"
            width={400}
            height={400}
            className="w-80 h-auto opacity-90"
          />
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-inter">Sign Up</h1>
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

          <div className="space-y-4 mb-6">
            {/* Social Login Buttons */}
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-neutral-200 rounded-lg px-4 py-3 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing up...' : 'Continue with Google'}
            </button>

            <button 
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-neutral-200 rounded-lg px-4 py-3 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {loading ? 'Signing up...' : 'Continue with Facebook'}
            </button>
          </div>

          <div className="text-center text-neutral-400 mb-6">or</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

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

            <div>
              <input
                type="password"
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-neutral-600">Already have an account? </span>
            <Link 
              href="/auth/login" 
              className="text-brand-blue hover:text-blue-600 font-medium transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
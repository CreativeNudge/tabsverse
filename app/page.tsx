import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Zap, Shield, Search, Layers, Database, Globe, Monitor } from 'lucide-react'
import { SiGooglechrome, SiSafari } from 'react-icons/si'
import { FaEdge } from 'react-icons/fa'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo/tabsverse-logo-transparent-small.png"
                alt="Tabsverse"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-bold font-inter text-gray-900">tabsverse</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/auth/login" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-gradient-to-br from-brand-pink via-brand-orange to-brand-orange text-white px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-brand-orange/25"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-32 left-1/4 w-96 h-96 bg-gradient-to-r from-brand-pink/10 to-brand-blue/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-brand-orange/8 to-brand-navy/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-brand-blue/5 via-brand-pink/5 to-brand-orange/5 rounded-full blur-3xl animate-spin-slow"></div>
          
          {/* Floating dots */}
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-brand-blue/60 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-brand-pink/60 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-brand-orange/60 rounded-full animate-ping"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-8 py-16">
            {/* Main headline - Fixed sizing and spacing */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight">
                <span className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">From Tab </span>
                <span className="bg-gradient-to-r from-brand-pink via-brand-orange to-brand-orange bg-clip-text text-transparent">Chaos</span>
              </h1>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight">
                <span className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">to Tab </span>
                <span className="bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent">Zen</span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your digital world, <span className="text-gray-900 font-medium">curated by you</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link 
                href="/auth/signup" 
                className="group relative bg-gradient-to-br from-brand-pink via-brand-orange to-brand-orange text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-brand-orange/25 border border-white/20"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Organizing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="#features" 
                className="text-gray-600 hover:text-gray-900 font-semibold text-lg transition-colors flex items-center gap-2 group"
              >
                See How It Works
                <div className="w-6 h-6 rounded-full border border-gray-300 group-hover:border-gray-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-16">
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg">
                <div className="text-3xl font-bold bg-gradient-to-br from-brand-pink to-brand-blue bg-clip-text text-transparent mb-2">100→1</div>
                <div className="text-gray-600 text-sm">From 100 open tabs to 1 organized dashboard</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg">
                <div className="text-3xl font-bold bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-transparent mb-2">∞</div>
                <div className="text-gray-600 text-sm">Your tabs follow you everywhere</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg">
                <div className="text-3xl font-bold bg-gradient-to-r from-brand-orange to-brand-navy bg-clip-text text-transparent mb-2">4+</div>
                <div className="text-gray-600 text-sm">Chrome, Firefox, Safari, Edge support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative bg-gradient-to-b from-white to-gray-50">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Professional Content Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform scattered digital resources into organized, accessible collections with enterprise-grade features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-brand-blue/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-navy rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Lightning Search</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find any saved resource instantly with our advanced search algorithm. No more lost tabs or forgotten bookmarks.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-brand-pink/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-pink to-brand-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Collections</h3>
                <p className="text-gray-600 leading-relaxed">
                  Organize resources with intelligent categorization, tags, and project-based sorting for maximum efficiency.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-brand-orange/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-brand-navy rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Universal Sync</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your organized collections from any device, anywhere. True cross-platform synchronization.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-brand-blue/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-pink rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Team Collaboration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share collections with teams, collaborate in real-time, and build knowledge repositories together.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-brand-pink/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-pink to-brand-navy rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Control</h3>
                <p className="text-gray-600 leading-relaxed">
                  Granular privacy settings, secure sharing, and enterprise-grade data protection for your content.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-brand-orange/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand your browsing patterns, optimize your workflow, and discover insights about your digital habits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browser Extensions */}
      <section className="py-32 relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-brand-navy/5 to-brand-blue/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-brand-pink/5 to-brand-orange/8 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Browser Extensions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamless integration with your favorite browsers. One-click saving from anywhere on the web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <SiGooglechrome className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Chrome Extension</h3>
                <p className="text-gray-600 mb-6">
                  Enhanced tab management with instant saving and organization features.
                </p>
                {/* Coming Soon Badge - Centered at bottom */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-brand-orange to-brand-pink text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <SiSafari className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Safari Extension</h3>
                <p className="text-gray-600 mb-6">
                  Native macOS and iOS integration with iCloud sync and Shortcuts support.
                </p>
                {/* Coming Soon Badge - Centered at bottom */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-brand-orange to-brand-pink text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FaEdge className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Edge Extension</h3>
                <p className="text-gray-600 mb-6">
                  Microsoft ecosystem integration with Teams and Office suite compatibility.
                </p>
                {/* Coming Soon Badge - Centered at bottom */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-brand-orange to-brand-pink text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink to-brand-blue"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-white/5 via-transparent to-white/5 rounded-full animate-spin-slow"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white leading-tight">
            Transform Your<br />
            Digital Experience
          </h2>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who&apos;ve revolutionized their content management workflow.
          </p>
          <Link 
            href="/auth/signup" 
            className="group inline-flex items-center gap-4 bg-white text-gray-900 px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
          >
            Start Your Transformation
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/logo/tabsverse-logo-transparent-small.png"
                  alt="Tabsverse"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="ml-3 text-2xl font-bold font-inter text-gray-900">tabsverse</span>
              </div>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Professional content management for the modern web. 
                Transform digital chaos into organized, accessible collections.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-6">Product</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="/auth/signup" className="hover:text-gray-900 transition-colors">Sign Up</Link></li>
                <li><Link href="/auth/login" className="hover:text-gray-900 transition-colors">Log In</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-6">Company</h3>
              <ul className="space-y-3 text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Tabsverse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

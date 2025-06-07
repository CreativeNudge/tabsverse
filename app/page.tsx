import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Zap, Shield, Search, Layers, Database, Globe, Monitor, Heart, Eye, Plus, Sparkles, BookOpen, Coffee, Palette, Code, Camera, Music } from 'lucide-react'
import { SiGooglechrome, SiSafari } from 'react-icons/si'
import { FaEdge } from 'react-icons/fa'

// Sample collection previews matching dashboard design
const sampleCollections = [
  {
    id: 1,
    title: "Design System Goldmine",
    description: "The most beautiful design systems from Apple, Stripe, and emerging startups",
    personality: "creative",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    itemCount: 47,
    likes: 234,
    views: 8947,
    icon: Palette,
    gradient: "from-purple-400 via-pink-400 to-red-400"
  },
  {
    id: 2,
    title: "Startup Founder's Toolkit",
    description: "Everything I wish I knew before starting my company",
    personality: "ambitious",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
    itemCount: 89,
    likes: 567,
    views: 15432,
    icon: BookOpen,
    gradient: "from-blue-500 via-blue-600 to-indigo-700"
  },
  {
    id: 3,
    title: "Photography Inspiration",
    description: "Curated collection of stunning photography and visual inspiration",
    personality: "artistic",
    coverImage: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=250&fit=crop",
    itemCount: 67,
    likes: 723,
    views: 18234,
    icon: Camera,
    gradient: "from-slate-400 via-gray-500 to-zinc-600"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 text-gray-900 overflow-x-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-conic from-orange-100/10 via-amber-100/10 to-yellow-100/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-orange-100/50 bg-white/80 backdrop-blur-xl">
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
              <span className="ml-3 text-xl font-bold font-inter text-stone-900">tabsverse</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/auth/login" 
                className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-gradient-to-br from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white px-6 py-2.5 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl"
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
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold leading-tight">
                <span className="bg-gradient-to-b from-stone-900 via-stone-800 to-stone-600 bg-clip-text text-transparent">From Tab </span>
                <span className="bg-gradient-to-r from-[#af0946] via-[#dc8c35] to-[#dc8c35] bg-clip-text text-transparent">Chaos</span>
              </h1>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold leading-tight">
                <span className="bg-gradient-to-b from-stone-900 via-stone-800 to-stone-600 bg-clip-text text-transparent">To Tab </span>
                <span className="bg-gradient-to-r from-[#31a9d6] to-[#000d85] bg-clip-text text-transparent">Zen</span>
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-2xl md:text-3xl text-stone-700 max-w-3xl mx-auto leading-relaxed font-medium">
                Your digital world, curated by you.
              </p>
              <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Close your browser with confidence. Never lose a link again.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link 
                href="/auth/signup" 
                className="group relative bg-gradient-to-br from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Start Curating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="#collections" 
                className="text-stone-600 hover:text-stone-900 font-semibold text-lg transition-colors flex items-center gap-2 group"
              >
                See Examples
                <div className="w-6 h-6 rounded-full border border-stone-300 group-hover:border-stone-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-16">
              <div className="bg-white/70 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-6 hover:bg-white/90 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20 hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-br from-[#af0946] to-[#31a9d6] bg-clip-text text-transparent mb-2">47→1</div>
                <div className="text-stone-600 text-sm">From 47 open tabs to 1 organized dashboard</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-6 hover:bg-white/90 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20 hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#af0946] to-[#dc8c35] bg-clip-text text-transparent mb-2">∞</div>
                <div className="text-stone-600 text-sm">Your curations follow you everywhere</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-6 hover:bg-white/90 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20 hover:scale-105">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#dc8c35] to-[#000d85] bg-clip-text text-transparent mb-2">♥</div>
                <div className="text-stone-600 text-sm">Beautiful collections you'll love to share</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-stone-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-stone-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Collection Preview Section */}
      <section id="collections" className="py-32 relative">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-gradient-to-b from-stone-900 to-stone-600 bg-clip-text text-transparent">
                Your Tab Groups, Beautifully Curated
              </h2>
              <Sparkles className="w-8 h-8 text-[#dc8c35] animate-pulse" />
            </div>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Every tab group becomes a visual story. See how your digital discoveries transform into magazine-quality presentations.
              </p>
          </div>

          {/* Collection Grid - Matching Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sampleCollections.map((collection, index) => {
              const IconComponent = collection.icon
              
              return (
                <div
                  key={collection.id}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-orange-100/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={collection.coverImage} 
                      alt={collection.title}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} opacity-60`}></div>
                    
                    {/* Floating icon */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-6 h-6 text-stone-700" />
                    </div>
                    
                    {/* Quick actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:scale-110 transition-transform group/heart">
                        <Heart className="w-5 h-5 text-red-400 group-hover/heart:fill-red-400 transition-all" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`text-xl ${collection.personality === 'creative' ? 'font-serif italic' : collection.personality === 'ambitious' ? 'font-sans font-bold' : 'font-serif'} text-stone-900 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#af0946] group-hover:to-[#dc8c35] group-hover:bg-clip-text transition-all duration-500 mb-3`}>
                      {collection.title}
                    </h3>
                    
                    <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    
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
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Floating Action Button Preview */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-orange-100/50">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#af0946] to-[#dc8c35] rounded-full flex items-center justify-center text-white shadow-2xl">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#af0946] to-[#dc8c35] rounded-full blur opacity-40 -z-10 animate-pulse"></div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-stone-900 mb-1">One-Click Creation</h3>
                <p className="text-stone-600">The floating + button is always ready to capture your discoveries</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-32 relative bg-gradient-to-b from-white/50 to-stone-50/50">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 bg-gradient-to-b from-stone-900 to-stone-600 bg-clip-text text-transparent">
              Instagram for Your Digital Life
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Turn scattered tabs into beautiful, shareable collections. Curate your digital discoveries like a social media feed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards with gradient system */}
            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-orange-200/50 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-[#31a9d6] to-[#000d85] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900 mb-4">Find Anything Instantly</h3>
              <p className="text-stone-600 leading-relaxed">
                Search through all your saved tabs like you&apos;re browsing your Instagram feed. Find that perfect resource in seconds.
              </p>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-orange-200/50 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-[#af0946] to-[#dc8c35] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900 mb-4">Visual Tab Groups</h3>
              <p className="text-stone-600 leading-relaxed">
                Organize your discoveries into beautiful visual collections. Each tab group tells a story with rich previews and custom themes.
              </p>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-orange-200/50 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-[#dc8c35] to-[#000d85] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900 mb-4">Everywhere You Go</h3>
              <p className="text-stone-600 leading-relaxed">
                Your curated tabs sync across all devices. Start browsing on your laptop, continue on your phone, just like social media.
              </p>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-orange-200/50 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-[#31a9d6] to-[#af0946] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900 mb-4">Share Your Discoveries</h3>
              <p className="text-stone-600 leading-relaxed">
                Share your curated collections with friends, teams, or the world. Like sharing a perfectly curated Instagram story.
              </p>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-orange-200/50 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-[#af0946] to-[#000d85] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900 mb-4">Your Privacy Matters</h3>
              <p className="text-stone-600 leading-relaxed">
                Choose what to keep private and what to share. Full control over your digital curation, just like your social profiles.
              </p>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-orange-200/50 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-[#dc8c35] to-[#31a9d6] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900 mb-4">Discover Amazing Content</h3>
              <p className="text-stone-600 leading-relaxed">
                Explore collections from creators, researchers, and curators worldwide. Find your next favorite resource through social discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browser Extensions */}
      <section className="py-32 relative overflow-hidden bg-stone-50/50">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 bg-gradient-to-b from-stone-900 to-stone-600 bg-clip-text text-transparent">
              Browser Extensions
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Seamless integration with your favorite browsers. One-click saving from anywhere on the web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-blue-300/50 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-500 hover:scale-105">
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <SiGooglechrome className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-900 mb-4">Chrome Extension</h3>
                <p className="text-stone-600 mb-6">
                  Enhanced tab management with instant saving and organization features.
                </p>
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-[#dc8c35] to-[#af0946] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-purple-300/50 hover:shadow-xl hover:shadow-purple-100/20 transition-all duration-500 hover:scale-105">
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <SiSafari className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-900 mb-4">Safari Extension</h3>
                <p className="text-stone-600 mb-6">
                  Native macOS and iOS integration with iCloud sync and Shortcuts support.
                </p>
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-[#dc8c35] to-[#af0946] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 hover:border-green-300/50 hover:shadow-xl hover:shadow-green-100/20 transition-all duration-500 hover:scale-105">
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FaEdge className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-900 mb-4">Edge Extension</h3>
                <p className="text-stone-600 mb-6">
                  Microsoft ecosystem integration with Teams and Office suite compatibility.
                </p>
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-[#dc8c35] to-[#af0946] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#dc8c35] to-[#af0946]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-white/5 via-transparent to-white/5 rounded-full animate-spin-slow"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white leading-tight">
              Transform Your Digital Life
            </h2>
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands who&apos;ve discovered digital serenity. Close your browser with confidence.
          </p>
          <Link 
            href="/auth/signup" 
            className="group inline-flex items-center gap-4 bg-white text-stone-900 px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-stone-50 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-white/20"
          >
            <Sparkles className="w-6 h-6" />
            Start Your Transformation
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-100/80 backdrop-blur-xl border-t border-orange-100/50 py-16">
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
                <span className="ml-3 text-2xl font-bold font-inter text-stone-900">tabsverse</span>
              </div>
              <p className="text-stone-600 max-w-md leading-relaxed">
                Digital serenity through beautiful curation. 
                Transform your scattered tabs into organized, shareable tab groups.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-stone-900 mb-6">Product</h3>
              <ul className="space-y-3 text-stone-600">
                <li><Link href="#collections" className="hover:text-stone-900 transition-colors">Tab Groups</Link></li>
                <li><Link href="#features" className="hover:text-stone-900 transition-colors">Features</Link></li>
                <li><Link href="/auth/signup" className="hover:text-stone-900 transition-colors">Sign Up</Link></li>
                <li><Link href="/auth/login" className="hover:text-stone-900 transition-colors">Log In</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-stone-900 mb-6">Company</h3>
              <ul className="space-y-3 text-stone-600">
                <li><Link href="/about" className="hover:text-stone-900 transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-stone-900 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-stone-900 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-orange-100/50 mt-12 pt-8 text-center text-stone-500">
            <p>&copy; 2024 Tabsverse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

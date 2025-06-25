'use client'

import { Search, TrendingUp, Globe, Users } from 'lucide-react'

export default function BrowsePage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-serif text-stone-800 leading-tight">
            Discover Amazing Curations
          </h1>
          <Globe className="w-8 h-8 text-orange-400 animate-pulse" />
        </div>
        
        <p className="text-stone-600 text-lg leading-relaxed mb-8">
          Explore curated collections from creators around the world. Find inspiration, 
          discover new resources, and connect with like-minded curators.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search curations, topics, or creators..."
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all text-stone-700 placeholder-stone-400"
          />
        </div>
      </div>

      {/* Browse Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif text-stone-800 mb-8">Browse by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, label: 'Trending', count: '1.2k curations', color: 'from-orange-400 to-red-500' },
            { icon: Users, label: 'Popular', count: '856 curations', color: 'from-blue-400 to-cyan-500' },
            { icon: Search, label: 'Recent', count: '342 curations', color: 'from-emerald-400 to-green-500' },
            { icon: Globe, label: 'Featured', count: '125 curations', color: 'from-purple-400 to-pink-500' },
          ].map((category, index) => (
            <div
              key={index}
              className="group bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-orange-100/50 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20 cursor-pointer"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">{category.label}</h3>
              <p className="text-stone-500 text-sm">{category.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-serif text-stone-800 mb-4">Coming Soon</h3>
          <p className="text-stone-600 leading-relaxed">
            We're building an amazing discovery experience. Soon you'll be able to explore 
            thousands of curated collections from creators worldwide!
          </p>
        </div>
      </div>
    </>
  )
}

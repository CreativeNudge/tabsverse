'use client'

import { Users, Share2, MessageCircle, UserPlus, Clock, Globe } from 'lucide-react'

export default function SharedPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-serif text-stone-800 leading-tight">
            Shared Curations
          </h1>
          <Users className="w-8 h-8 text-orange-400 animate-pulse" />
        </div>
        
        <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-3xl">
          Collaborate with others, share your collections, and discover curations that have been 
          shared with you. Build amazing collections together with friends, colleagues, and the community.
        </p>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#af0946] to-[#dc8c35] text-white rounded-2xl font-semibold hover:scale-105 transition-all shadow-lg">
            <UserPlus className="w-5 h-5" />
            Invite Collaborators
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-white/60 text-stone-700 rounded-2xl font-semibold hover:bg-white/80 border border-stone-200 transition-all">
            <Share2 className="w-5 h-5" />
            Share Collection
          </button>
        </div>
      </div>

      {/* Collaboration Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          {
            title: 'Shared with Me',
            description: 'Collections others have shared with you',
            count: '3 collections',
            icon: Share2,
            color: 'from-blue-400 to-cyan-500',
            action: 'View Shared'
          },
          {
            title: 'My Collaborations',
            description: 'Collections you\'re working on with others',
            count: '1 active project',
            icon: Users,
            color: 'from-emerald-400 to-green-500',
            action: 'Manage'
          },
          {
            title: 'Shared by Me',
            description: 'Collections you\'ve shared with others',
            count: '2 collections',
            icon: Globe,
            color: 'from-orange-400 to-red-500',
            action: 'View All'
          }
        ].map((category, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-100/50 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20">
            <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
              <category.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-stone-800 mb-3">{category.title}</h3>
            <p className="text-stone-600 mb-4 leading-relaxed">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-orange-600 font-medium">{category.count}</span>
              <button className="text-stone-500 hover:text-orange-600 transition-colors font-medium">
                {category.action} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif text-stone-800 mb-8">Recent Activity</h2>
        
        <div className="space-y-4">
          {[
            {
              type: 'shared',
              user: 'Sarah Chen',
              action: 'shared "Design System Resources" with you',
              time: '2 hours ago',
              avatar: '👩‍💼'
            },
            {
              type: 'comment',
              user: 'Mike Rodriguez',
              action: 'commented on "AI Tools Collection"',
              time: '1 day ago',
              avatar: '👨‍💻'
            },
            {
              type: 'collaboration',
              user: 'Alex Kim',
              action: 'added 3 new links to "Marketing Resources"',
              time: '2 days ago',
              avatar: '👨‍🎨'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-6 bg-white/40 backdrop-blur-xl rounded-2xl border border-stone-200/50 hover:bg-white/60 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-lg">
                {activity.avatar}
              </div>
              <div className="flex-1">
                <p className="text-stone-800">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  <span className="text-stone-600">{activity.action}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span className="text-stone-500 text-sm">{activity.time}</span>
                </div>
              </div>
              <button className="text-stone-400 hover:text-orange-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-serif text-stone-800 mb-4">Collaboration Features Coming Soon</h3>
          <p className="text-stone-600 leading-relaxed">
            We're building powerful collaboration tools that will let you create amazing collections together with others!
          </p>
        </div>
      </div>
    </>
  )
}

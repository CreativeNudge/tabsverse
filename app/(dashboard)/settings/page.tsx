'use client'

import { Settings, User, Bell, Shield, Palette, Globe, Database, CreditCard } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function SettingsPage() {
  const { user } = useAuth()

  const settingsSections = [
    {
      title: 'Profile Settings',
      description: 'Manage your profile information and preferences',
      icon: User,
      color: 'from-blue-400 to-cyan-500',
      settings: [
        { label: 'Display Name', value: user?.user_metadata?.full_name || 'Not set', type: 'text' },
        { label: 'Username', value: '@username', type: 'text' },
        { label: 'Bio', value: 'Add a bio to tell others about yourself', type: 'textarea' },
        { label: 'Profile Visibility', value: 'Public', type: 'select' }
      ]
    },
    {
      title: 'Notifications',
      description: 'Control how and when you receive notifications',
      icon: Bell,
      color: 'from-emerald-400 to-green-500',
      settings: [
        { label: 'Email Notifications', value: true, type: 'toggle' },
        { label: 'Push Notifications', value: false, type: 'toggle' },
        { label: 'Weekly Digest', value: true, type: 'toggle' },
        { label: 'Collaboration Updates', value: true, type: 'toggle' }
      ]
    },
    {
      title: 'Privacy & Security',
      description: 'Manage your privacy settings and account security',
      icon: Shield,
      color: 'from-orange-400 to-red-500',
      settings: [
        { label: 'Default Curation Visibility', value: 'Private', type: 'select' },
        { label: 'Allow Comments', value: true, type: 'toggle' },
        { label: 'Show in Discovery', value: false, type: 'toggle' },
        { label: 'Two-Factor Authentication', value: 'Disabled', type: 'action' }
      ]
    },
    {
      title: 'Appearance',
      description: 'Customize how Tabsverse looks and feels',
      icon: Palette,
      color: 'from-purple-400 to-pink-500',
      settings: [
        { label: 'Theme', value: 'Light', type: 'select' },
        { label: 'Accent Color', value: 'Orange', type: 'select' },
        { label: 'Compact View', value: false, type: 'toggle' },
        { label: 'Animations', value: true, type: 'toggle' }
      ]
    }
  ]

  return (
    <>
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-serif text-stone-800 leading-tight">
            Settings
          </h1>
          <Settings className="w-8 h-8 text-orange-400 animate-pulse" />
        </div>
        
        <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-3xl">
          Customize your Tabsverse experience. Adjust your preferences, manage your privacy settings, 
          and control how you interact with the community.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8 mb-12">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white/60 backdrop-blur-xl rounded-3xl border border-orange-100/50">
            {/* Section Header */}
            <div className="p-8 border-b border-stone-200/50">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-stone-800">{section.title}</h3>
                  <p className="text-stone-600 text-sm">{section.description}</p>
                </div>
              </div>
            </div>

            {/* Settings Items */}
            <div className="p-8">
              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between">
                    <div>
                      <label className="text-stone-800 font-medium">{setting.label}</label>
                      {setting.type === 'textarea' && (
                        <p className="text-stone-500 text-sm mt-1">Add a bio to tell others about yourself</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {setting.type === 'toggle' && (
                        <button className={`relative w-12 h-6 rounded-full transition-colors ${
                          setting.value ? 'bg-gradient-to-r from-[#af0946] to-[#dc8c35]' : 'bg-stone-300'
                        }`}>
                          <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-0.5'
                          } top-0.5`}></div>
                        </button>
                      )}
                      
                      {setting.type === 'text' && (
                        <input
                          type="text"
                          defaultValue={setting.value}
                          className="px-4 py-2 bg-white/60 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all min-w-[200px]"
                        />
                      )}
                      
                      {setting.type === 'select' && (
                        <select className="px-4 py-2 bg-white/60 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all min-w-[150px]">
                          <option>{setting.value}</option>
                        </select>
                      )}
                      
                      {setting.type === 'action' && (
                        <button className="px-4 py-2 bg-gradient-to-r from-[#af0946] to-[#dc8c35] text-white rounded-xl font-medium hover:scale-105 transition-all">
                          Enable
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Management */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-orange-100/50 p-8 mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-stone-400 to-stone-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-stone-800">Account Management</h3>
            <p className="text-stone-600 text-sm">Manage your account data and subscription</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-stone-200 hover:bg-white/80 transition-all">
            <Database className="w-5 h-5 text-blue-500" />
            <span className="text-stone-700 font-medium">Export Data</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-stone-200 hover:bg-white/80 transition-all">
            <CreditCard className="w-5 h-5 text-green-500" />
            <span className="text-stone-700 font-medium">Billing</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-200 hover:bg-red-100 transition-all">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Delete Account</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-4 bg-gradient-to-r from-[#af0946] to-[#dc8c35] text-white rounded-2xl font-semibold hover:scale-105 transition-all shadow-lg">
          Save Changes
        </button>
      </div>
    </>
  )
}

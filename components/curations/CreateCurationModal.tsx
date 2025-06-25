import { useState } from 'react'
import { Plus, RefreshCw, Sparkles, Camera, Palette, Briefcase, MapPin, Code, Music } from 'lucide-react'

interface CreateCurationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: CurationFormData) => Promise<void>
  isLoading: boolean
  limitInfo: {
    remaining: number
  }
}

export interface CurationFormData {
  title: string
  description: string
  visibility: 'private' | 'public'
  tags: string
  personality: 'creative' | 'ambitious' | 'wanderlust' | 'technical' | 'artistic' | 'mindful'
}

const personalities = [
  { id: 'creative', icon: Palette, label: '🎨 Creative', desc: 'Artistic, expressive, visually-driven', color: 'purple' },
  { id: 'ambitious', icon: Briefcase, label: '💼 Ambitious', desc: 'Professional, goal-oriented, powerful', color: 'blue' },
  { id: 'wanderlust', icon: MapPin, label: '✈️ Wanderlust', desc: 'Travel, exploration, adventure', color: 'orange' },
  { id: 'technical', icon: Code, label: '💻 Technical', desc: 'Precise, systematic, code-focused', color: 'green' },
  { id: 'artistic', icon: Camera, label: '🎭 Artistic', desc: 'Creative expression, visual arts', color: 'gray' },
  { id: 'mindful', icon: Music, label: '🧘 Mindful', desc: 'Calm, centered, thoughtful', color: 'indigo' }
] as const

export default function CreateCurationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  limitInfo 
}: CreateCurationModalProps) {
  const [formData, setFormData] = useState<CurationFormData>({
    title: '',
    description: '',
    visibility: 'private',
    tags: '',
    personality: 'creative'
  })

  const handleFormChange = (field: keyof CurationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for your curation')
      return
    }

    await onSubmit(formData)
    
    // Reset form on success
    setFormData({
      title: '',
      description: '',
      visibility: 'private',
      tags: '',
      personality: 'creative'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-50 to-amber-50/30 px-8 py-6 border-b border-stone-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-800">Create Curation</h2>
              <p className="text-stone-600 mt-1">Start curating your digital discoveries ({limitInfo.remaining} remaining)</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-stone-600 rotate-45" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Curation Title*
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="e.g., Design System Goldmine, Tokyo Coffee Culture"
              className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 text-lg"
              autoFocus
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="What makes this curation special? What will people discover?"
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400 resize-none"
              maxLength={500}
            />
          </div>

          {/* Quick Setup Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Visibility Toggle */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Visibility</label>
              <div className="flex bg-stone-100 rounded-2xl p-1">
                <button 
                  type="button"
                  onClick={() => handleFormChange('visibility', 'private')}
                  className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                    formData.visibility === 'private' 
                      ? 'bg-white shadow-sm text-stone-700' 
                      : 'text-stone-600 hover:text-stone-700'
                  }`}
                >
                  🔒 Private
                </button>
                <button 
                  type="button"
                  onClick={() => handleFormChange('visibility', 'public')}
                  className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                    formData.visibility === 'public' 
                      ? 'bg-white shadow-sm text-stone-700' 
                      : 'text-stone-600 hover:text-stone-700'
                  }`}
                >
                  🌍 Public
                </button>
              </div>
            </div>

            {/* Quick Tags */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Quick Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleFormChange('tags', e.target.value)}
                placeholder="design, tools, inspiration"
                className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white transition-all text-stone-700 placeholder-stone-400"
              />
            </div>
          </div>

          {/* Personality Selection */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-3">Choose Your Collection's Personality</label>
            <div className="grid grid-cols-2 gap-3">
              {personalities.map((personality) => {
                const IconComponent = personality.icon
                const isSelected = formData.personality === personality.id
                return (
                  <button 
                    key={personality.id}
                    type="button"
                    onClick={() => handleFormChange('personality', personality.id)}
                    className={`p-4 border rounded-2xl transition-all text-left group ${
                      isSelected 
                        ? 'border-orange-300 bg-orange-50 ring-2 ring-orange-200' 
                        : 'border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className={`w-5 h-5 text-${personality.color}-500`} />
                      <span className="font-semibold text-stone-800">{personality.label}</span>
                    </div>
                    <p className="text-sm text-stone-600">{personality.desc}</p>
                  </button>
                )
              })}
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
        <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex items-center justify-between flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${
              isLoading 
                ? 'bg-gradient-to-r from-[#31a9d6] to-[#000d85] text-white scale-105' 
                : 'bg-gradient-to-r from-[#af0946] to-[#dc8c35] hover:from-[#31a9d6] hover:to-[#000d85] text-white hover:scale-105'
            } shadow-lg hover:shadow-xl`}
            disabled={isLoading}
          >
            {isLoading ? (
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
  )
}

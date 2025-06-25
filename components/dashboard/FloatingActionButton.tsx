import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
  variant?: 'create' | 'add'
  tooltipText?: string
}

export default function FloatingActionButton({ 
  onClick, 
  variant = 'create',
  tooltipText 
}: FloatingActionButtonProps) {
  
  // Gradient and tooltip based on variant
  const variants = {
    create: {
      gradient: 'from-[#af0946] to-[#dc8c35]',
      hoverGradient: 'hover:from-[#31a9d6] hover:to-[#000d85]',
      glowGradient: 'from-[#af0946] to-[#dc8c35]',
      hoverGlowGradient: 'group-hover:from-[#31a9d6] group-hover:to-[#000d85]',
      tooltip: tooltipText || 'Create Curation'
    },
    add: {
      gradient: 'from-[#31a9d6] to-[#000d85]',
      hoverGradient: 'hover:from-[#af0946] hover:to-[#dc8c35]',
      glowGradient: 'from-[#31a9d6] to-[#000d85]',
      hoverGlowGradient: 'group-hover:from-[#af0946] group-hover:to-[#dc8c35]',
      tooltip: tooltipText || 'Add Tab'
    }
  }

  const currentVariant = variants[variant]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button 
        onClick={onClick}
        className={`group relative w-16 h-16 bg-gradient-to-br ${currentVariant.gradient} ${currentVariant.hoverGradient} rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110`}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentVariant.glowGradient} ${currentVariant.hoverGlowGradient} rounded-full blur opacity-40 -z-10 animate-pulse`}></div>
        
        <Plus className="w-8 h-8 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
        
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 px-4 py-2 bg-stone-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-2xl">
          {currentVariant.tooltip}
          <div className="absolute bottom-0 right-6 transform translate-y-1 w-2 h-2 bg-stone-800 rotate-45"></div>
        </div>
      </button>
    </div>
  )
}

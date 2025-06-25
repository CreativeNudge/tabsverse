import Image from 'next/image'
import { 
  Home, 
  User, 
  Users, 
  Globe, 
  Settings, 
  LogOut,
  LucideIcon
} from 'lucide-react'

interface SidebarItem {
  id: string
  icon: LucideIcon
  label: string
}

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (sectionId: string) => void
  onSignOut: () => void
}

const sidebarItems: SidebarItem[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'personal', icon: User, label: 'Personal' },
  { id: 'shared', icon: Users, label: 'Shared' },
  { id: 'community', icon: Globe, label: 'Community' }
]

export default function DashboardSidebar({ activeSection, onSectionChange, onSignOut }: DashboardSidebarProps) {
  return (
    <div className="relative w-20 bg-white/80 backdrop-blur-xl flex flex-col items-center shadow-xl border-r border-orange-100/50">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 via-transparent to-amber-50/30"></div>
      
      {/* Logo */}
      <div className="relative z-10 pt-6 pb-2">
        <Image
          src="/logo/tabsverse-logo-transparent-small.png"
          alt="Tabsverse"
          width={32}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </div>
      
      {/* Navigation Icons */}
      <div className="mt-6 space-y-2 relative z-10">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeSection === item.id
                ? 'bg-gradient-to-br from-[#af0946] to-[#dc8c35] text-white shadow-md'
                : 'text-stone-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            <item.icon className="w-5 h-5 relative z-10" />
            
            {/* Tooltip */}
            <div className="absolute left-16 px-3 py-2 bg-stone-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-lg">
              {item.label}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-stone-800 rotate-45"></div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Bottom actions */}
      <div className="pb-6 space-y-2 relative z-10">
        <button className="group relative w-12 h-12 rounded-xl flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200">
          <Settings className="w-5 h-5" />
          <div className="absolute left-16 px-3 py-2 bg-stone-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-lg">
            Settings
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-stone-800 rotate-45"></div>
          </div>
        </button>
        
        <button 
          onClick={onSignOut}
          className="group relative w-12 h-12 rounded-xl flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <div className="absolute left-16 px-3 py-2 bg-stone-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-30 shadow-lg">
            Sign Out
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-stone-800 rotate-45"></div>
          </div>
        </button>
      </div>
    </div>
  )
}

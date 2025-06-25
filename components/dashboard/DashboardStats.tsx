import { BookOpen, Palette, Eye } from 'lucide-react'

interface DashboardStatsProps {
  linksCurated: number
  curationsCount: number
  totalViews: number
}

export default function DashboardStats({ linksCurated, curationsCount, totalViews }: DashboardStatsProps) {
  const stats = [
    {
      icon: BookOpen,
      value: linksCurated,
      label: 'Links Curated',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Palette,
      value: curationsCount,
      label: 'Curations',
      gradient: 'from-emerald-400 to-green-500'
    },
    {
      icon: Eye,
      value: totalViews,
      label: 'Total Views',
      gradient: 'from-orange-400 to-red-500',
      format: 'number'
    }
  ]

  const formatValue = (value: number, format?: string) => {
    if (format === 'number') {
      return value.toLocaleString()
    }
    return value.toString()
  }

  return (
    <div className="grid grid-cols-3 gap-8 mb-12">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-100/50 hover:border-orange-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-100/20"
        >
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-stone-800 mb-1">
                {formatValue(stat.value, stat.format)}
              </div>
              <div className="text-stone-500 font-medium">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

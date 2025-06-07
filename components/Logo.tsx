import Image from 'next/image'

interface LogoProps {
  variant?: 'default' | 'icon' | 'wordmark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
  textColor?: 'light' | 'dark'
}

export default function Logo({ 
  variant = 'default', 
  size = 'md', 
  showText = true,
  className = '',
  textColor = 'dark'
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
    xl: { icon: 48, text: 'text-3xl' }
  }

  const textColorClass = textColor === 'light' ? 'text-white' : 'text-gray-900'

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Image
          src="/logo/tabsverse-logo-transparent-small.png"
          alt="Tabsverse"
          width={sizeMap[size].icon}
          height={sizeMap[size].icon}
          className="w-auto h-auto"
          priority
        />
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={`flex items-center ${className}`}>
        <span className={`font-inter font-bold ${sizeMap[size].text} ${textColorClass}`}>
          tabsverse
        </span>
      </div>
    )
  }

  // Default variant with icon + text
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo/tabsverse-logo-transparent-small.png"
        alt="Tabsverse"
        width={sizeMap[size].icon}
        height={sizeMap[size].icon}
        className="w-auto h-auto"
        priority
      />
      
      {showText && (
        <span className={`ml-3 font-inter font-bold ${sizeMap[size].text} ${textColorClass}`}>
          tabsverse
        </span>
      )}
    </div>
  )
}
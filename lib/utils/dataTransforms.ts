import { 
  // Technology & Tools
  Laptop, Cpu, Smartphone, Monitor, Zap,
  // Design & Creative  
  Palette, Brush, Camera, Sparkles, Layers,
  // Business & Career
  Briefcase, TrendingUp, Building, Target, Users,
  // Education & Learning
  GraduationCap, BookOpen, Lightbulb, Library, Award,
  // Lifestyle & Health
  Heart, Leaf, Dumbbell, Sun, Coffee,
  // Travel & Places
  Compass, MapPin, Globe, Plane, Mountain,
  // Food & Cooking
  ChefHat, Utensils, Apple, Wine, Cookie,
  // Entertainment & Media
  Play, Music, Book, Gamepad2, Headphones,
  // News & Current Events
  Newspaper, Radio, Tv, MessageCircle, Rss,
  // Shopping & Products
  ShoppingBag, Star, Gift, CreditCard, Package,
  // Home & DIY
  Home, Hammer, Paintbrush, TreePine, Scissors,
  // Finance & Investing
  DollarSign, PiggyBank, Calculator, Wallet, TrendingDown
} from 'lucide-react'
import type { Database } from '@/types/database'

// Database types
type Group = Database['public']['Tables']['groups']['Row']
type CollectionCategory = Database['public']['Enums']['collection_category']

interface GroupWithUser extends Group {
  user: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
}

interface CollectionData {
  id: string
  title: string
  description: string
  primary_category: CollectionCategory
  secondary_category?: CollectionCategory | null
  coverImage: string
  itemCount: number
  likes: number
  views: number
  comments: number
  lastUpdated: string
  tags: string[]
  primaryIcon: any // Lucide Icon component
  secondaryIcon?: any // Lucide Icon component for secondary category
  gradient: string
}

// Smart cover image system - diverse category-specific images
export const getCategoryCoverImages = (category: CollectionCategory): string[] => {
  const imageCollections = {
    technology: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2a6f?w=400&h=250&fit=crop', // Abstract tech
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop', // Code on screens
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop', // Laptop workspace
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop', // Tech devices
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop', // AI/ML visualization
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop', // Programming setup
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', // Data analytics
    ],
    design: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop', // Creative workspace
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop', // Design tools
      'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=400&h=250&fit=crop', // Color palettes
      'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=250&fit=crop', // Sketch workspace
      'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=250&fit=crop', // Artistic setup
      'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?w=400&h=250&fit=crop', // Designer desk
    ],
    business: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop', // Office meeting
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=250&fit=crop', // Business charts
      'https://images.unsplash.com/photo-1664575262619-b28fef7a40a4?w=400&h=250&fit=crop', // Professional workspace
      'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=250&fit=crop', // Team collaboration
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&h=250&fit=crop', // Modern office
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop', // Business presentation
    ],
    education: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop', // Library books
      'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=250&fit=crop', // University hall
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop', // Study setup
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop', // Classroom
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop', // Learning environment
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop', // Academic workspace
    ],
    lifestyle: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', // Wellness/meditation
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop', // Fitness/health
      'https://images.unsplash.com/photo-1499728603263-13726abce5ca?w=400&h=250&fit=crop', // Healthy lifestyle
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop', // Self-care
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop', // Personal growth
      'https://images.unsplash.com/photo-1515787366009-7c8f6c2df86b?w=400&h=250&fit=crop', // Mindful living
    ],
    travel: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop', // Adventure landscape
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=250&fit=crop', // Travel planning
      'https://images.unsplash.com/photo-1606768666853-403c90a981ad?w=400&h=250&fit=crop', // Destination
      'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400&h=250&fit=crop', // Journey
      'https://images.unsplash.com/photo-1502943693086-33b5b1cfdf2f?w=400&h=250&fit=crop', // Exploration
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop', // Travel vibes
    ],
    food: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=250&fit=crop', // Coffee culture
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop', // Food preparation
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop', // Culinary art
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop', // Restaurant vibes
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop', // Cooking scene
      'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=250&fit=crop', // Food styling
    ],
    entertainment: [
      'https://images.unsplash.com/photo-1489599856847-72d6a0506693?w=400&h=250&fit=crop', // Music/audio
      'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&h=250&fit=crop', // Gaming setup
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop', // Entertainment center
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?w=400&h=250&fit=crop', // Media consumption
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=250&fit=crop', // Creative entertainment
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop', // Digital entertainment
    ],
    news: [
      'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop', // News/journalism
      'https://images.unsplash.com/photo-1551817958-11e0f7bbea9b?w=400&h=250&fit=crop', // Current events
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop', // Information
      'https://images.unsplash.com/photo-1594736797933-d0edd6eb6d7a?w=400&h=250&fit=crop', // Media landscape
      'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=400&h=250&fit=crop', // Information flow
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=250&fit=crop', // News media
    ],
    shopping: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop', // Shopping experience
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop', // Product discovery
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=250&fit=crop', // Retail therapy
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=250&fit=crop', // Shopping vibes
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop', // Commerce
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop', // Shopping bags
    ],
    home: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop', // Home design
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=250&fit=crop', // DIY projects
      'https://images.unsplash.com/photo-1566649924390-dff7bdcf13c5?w=400&h=250&fit=crop', // Home improvement
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&h=250&fit=crop', // Interior design
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=250&fit=crop', // Home organization
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=250&fit=crop', // Cozy home
    ],
    finance: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop', // Financial planning
      'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=250&fit=crop', // Investment
      'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&h=250&fit=crop', // Money management
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop', // Financial growth
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop', // Wealth building
      'https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?w=400&h=250&fit=crop', // Financial tech
    ]
  }
  
  return imageCollections[category] || imageCollections.technology
}

// Generate a smart cover image based on category and collection ID for uniqueness
export const generateSmartCoverImage = (category: CollectionCategory, collectionId: string): string => {
  const categoryImages = getCategoryCoverImages(category)
  
  // Use collection ID to create consistent but varied selection
  const hash = collectionId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const imageIndex = Math.abs(hash) % categoryImages.length
  return categoryImages[imageIndex]
}

// Brand-aligned icon system for 12 categories
export const getCategoryIcon = (category: CollectionCategory) => {
  const iconMap = {
    technology: Laptop,        // Clean, modern tech representation
    design: Palette,           // Classic creative tool, matches brand
    business: Briefcase,       // Professional, universally recognized
    education: GraduationCap,  // Academic achievement symbol
    lifestyle: Heart,          // Wellness and personal life
    travel: Compass,           // Adventure and navigation
    food: ChefHat,            // Culinary expertise and cooking
    entertainment: Play,       // Media consumption and fun
    news: Newspaper,          // Information and current events
    shopping: ShoppingBag,    // Commerce and products
    home: Home,               // Domestic life and DIY
    finance: PiggyBank        // Money management and investing
  }
  return iconMap[category] || Laptop
}

// Brand gradient system based on category
export const getCategoryGradient = (category: CollectionCategory) => {
  const gradientMap = {
    technology: 'from-blue-500/20 to-cyan-500/20',      // Tech blue
    design: 'from-purple-500/20 to-pink-500/20',        // Creative purple-pink
    business: 'from-slate-500/20 to-blue-600/20',       // Professional gray-blue
    education: 'from-emerald-500/20 to-teal-500/20',    // Growth green
    lifestyle: 'from-rose-500/20 to-orange-500/20',     // Warm lifestyle colors
    travel: 'from-orange-500/20 to-amber-500/20',       // Adventure orange
    food: 'from-red-500/20 to-orange-500/20',           // Appetizing red-orange
    entertainment: 'from-indigo-500/20 to-purple-500/20', // Media purple
    news: 'from-gray-500/20 to-slate-500/20',           // Neutral news gray
    shopping: 'from-pink-500/20 to-rose-500/20',        // Shopping pink
    home: 'from-green-500/20 to-emerald-500/20',        // Home green
    finance: 'from-emerald-600/20 to-green-600/20'      // Money green
  }
  return gradientMap[category] || gradientMap.technology
}

// Brand color mapping for category icons
export const getCategoryIconColor = (category: CollectionCategory, isSecondary: boolean = false) => {
  const baseColors = {
    technology: 'text-blue-600',
    design: 'text-purple-600', 
    business: 'text-slate-600',
    education: 'text-emerald-600',
    lifestyle: 'text-rose-600',
    travel: 'text-orange-600',
    food: 'text-red-600',
    entertainment: 'text-indigo-600',
    news: 'text-gray-600',
    shopping: 'text-pink-600',
    home: 'text-green-600',
    finance: 'text-emerald-700'
  }
  
  // Secondary icons are more subtle
  const secondaryColors = {
    technology: 'text-blue-400',
    design: 'text-purple-400',
    business: 'text-slate-400',
    education: 'text-emerald-400',
    lifestyle: 'text-rose-400',
    travel: 'text-orange-400',
    food: 'text-red-400',
    entertainment: 'text-indigo-400',
    news: 'text-gray-400',
    shopping: 'text-pink-400',
    home: 'text-green-400',
    finance: 'text-emerald-500'
  }
  
  return isSecondary ? 
    (secondaryColors[category] || secondaryColors.technology) : 
    (baseColors[category] || baseColors.technology)
}

export const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

// Main transformation function - updated for category system with smart images
export const transformGroupToCollection = (group: GroupWithUser): CollectionData => {
  const primaryCategory = group.primary_category || 'technology'
  const secondaryCategory = group.secondary_category || null
  
  // Use custom image if provided, otherwise generate smart category-based image
  const coverImage = group.cover_image_url || generateSmartCoverImage(primaryCategory, group.id)
  
  return {
    id: group.id,
    title: group.title,
    description: group.description || 'No description provided',
    primary_category: primaryCategory,
    secondary_category: secondaryCategory,
    coverImage,
    itemCount: group.tab_count || 0,
    likes: group.like_count || 0,
    views: group.view_count || 0,
    comments: group.comment_count || 0,
    lastUpdated: formatLastUpdated(group.updated_at),
    tags: Array.isArray(group.tags) ? group.tags : [],
    primaryIcon: getCategoryIcon(primaryCategory),
    secondaryIcon: secondaryCategory ? getCategoryIcon(secondaryCategory) : undefined,
    gradient: getCategoryGradient(primaryCategory),
  }
}

// Batch transformation
export const transformGroupsToCollections = (groups: GroupWithUser[]): CollectionData[] => {
  return groups.map(transformGroupToCollection)
}

// Validation function - updated for category system
export const validateCollectionData = (data: any): data is CollectionData => {
  return (
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.primary_category === 'string' &&
    typeof data.coverImage === 'string' &&
    typeof data.itemCount === 'number' &&
    typeof data.likes === 'number' &&
    typeof data.views === 'number' &&
    typeof data.comments === 'number' &&
    typeof data.lastUpdated === 'string' &&
    Array.isArray(data.tags) &&
    typeof data.gradient === 'string'
  )
}

// Utility to get category display name
export const getCategoryDisplayName = (category: CollectionCategory): string => {
  const displayNames = {
    technology: 'Technology',
    design: 'Design',
    business: 'Business',
    education: 'Education', 
    lifestyle: 'Lifestyle',
    travel: 'Travel',
    food: 'Food',
    entertainment: 'Entertainment',
    news: 'News',
    shopping: 'Shopping',
    home: 'Home',
    finance: 'Finance'
  }
  return displayNames[category] || 'Technology'
}

// Helper to get all available categories
export const getAllCategories = (): CollectionCategory[] => {
  return [
    'technology', 'design', 'business', 'education',
    'lifestyle', 'travel', 'food', 'entertainment', 
    'news', 'shopping', 'home', 'finance'
  ]
}
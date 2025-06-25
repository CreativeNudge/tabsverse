import { Palette, Briefcase, Coffee, Laptop, Camera, Heart } from 'lucide-react'
import type { CollectionData } from '@/types/dashboard'

export const mockEnhancedCollections: CollectionData[] = [
  {
    id: "mock-1",
    title: "Design System Goldmine",
    description: "The most beautiful design systems from Apple, Stripe, and emerging startups",
    primary_category: "design",
    secondary_category: "technology",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    itemCount: 47,
    likes: 234,
    views: 8947,
    comments: 23,
    lastUpdated: "2 hours ago",
    tags: ["Design", "UI/UX", "Systems"],
    primaryIcon: Palette,
    secondaryIcon: Laptop,
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: "mock-2",
    title: "Startup Founder's Toolkit",
    description: "Everything I wish I knew before starting my company - legal, finance, growth",
    primary_category: "business",
    secondary_category: "finance",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
    itemCount: 89,
    likes: 567,
    views: 15432,
    comments: 89,
    lastUpdated: "1 day ago",
    tags: ["Business", "Startup", "Tools"],
    primaryIcon: Briefcase,
    secondaryIcon: Coffee, // Using Coffee as placeholder for finance icon
    gradient: "from-slate-500/20 to-blue-600/20"
  },
  {
    id: "mock-3",
    title: "Tokyo Coffee Culture",
    description: "Hidden gems and aesthetic cafes discovered during my month in Shibuya",
    primary_category: "travel",
    secondary_category: "food",
    coverImage: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=250&fit=crop",
    itemCount: 23,
    likes: 892,
    views: 12043,
    comments: 156,
    lastUpdated: "3 days ago",
    tags: ["Travel", "Coffee", "Japan"],
    primaryIcon: Coffee, // Compass would be better but using Coffee for now
    secondaryIcon: Coffee,
    gradient: "from-orange-500/20 to-amber-500/20"
  },
  {
    id: "mock-4",
    title: "AI Development Resources",
    description: "Curated tools, papers, and tutorials for building production AI applications",
    primary_category: "technology",
    secondary_category: "education",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
    itemCount: 134,
    likes: 1203,
    views: 24781,
    comments: 67,
    lastUpdated: "5 hours ago",
    tags: ["AI", "Development", "Tech"],
    primaryIcon: Laptop,
    secondaryIcon: Briefcase, // Using Briefcase as placeholder for education
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "mock-5",
    title: "Street Photography Masters",
    description: "Inspiring work from contemporary photographers capturing urban life",
    primary_category: "design",
    secondary_category: "entertainment",
    coverImage: "https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?w=400&h=250&fit=crop",
    itemCount: 76,
    likes: 445,
    views: 9876,
    comments: 34,
    lastUpdated: "Yesterday",
    tags: ["Photography", "Art", "Urban"],
    primaryIcon: Camera,
    secondaryIcon: Palette,
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: "mock-6",
    title: "Meditation & Flow States",
    description: "Practices, apps, and research on achieving deep focus and inner peace",
    primary_category: "lifestyle",
    secondary_category: null,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    itemCount: 42,
    likes: 687,
    views: 13254,
    comments: 98,
    lastUpdated: "2 days ago",
    tags: ["Wellness", "Productivity", "Mind"],
    primaryIcon: Heart,
    secondaryIcon: undefined,
    gradient: "from-rose-500/20 to-orange-500/20"
  }
]
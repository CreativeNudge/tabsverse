// URL Metadata Detection and Auto-Population

export interface UrlMetadata {
  title: string
  description: string
  thumbnail: string | null
  favicon: string | null
  domain: string
  resourceType: string
  suggestedTags: string[]
  confidence: 'high' | 'medium' | 'low'
}

// Domain-based auto-detection rules
const DOMAIN_RULES: Record<string, {
  type: string
  defaultTags: string[]
  confidence: 'high' | 'medium'
}> = {
  // Video platforms
  'youtube.com': { type: 'video', defaultTags: ['video', 'content'], confidence: 'high' },
  'youtu.be': { type: 'video', defaultTags: ['video', 'youtube'], confidence: 'high' },
  'vimeo.com': { type: 'video', defaultTags: ['video', 'creative'], confidence: 'high' },
  'twitch.tv': { type: 'video', defaultTags: ['gaming', 'streaming'], confidence: 'high' },
  'tiktok.com': { type: 'video', defaultTags: ['video', 'social'], confidence: 'high' },
  
  // Design platforms
  'dribbble.com': { type: 'image', defaultTags: ['design', 'inspiration'], confidence: 'high' },
  'behance.net': { type: 'image', defaultTags: ['portfolio', 'design'], confidence: 'high' },
  'figma.com': { type: 'document', defaultTags: ['design', 'prototype'], confidence: 'high' },
  'sketch.com': { type: 'document', defaultTags: ['design', 'ui'], confidence: 'high' },
  'canva.com': { type: 'document', defaultTags: ['design', 'template'], confidence: 'high' },
  
  // Development
  'github.com': { type: 'webpage', defaultTags: ['code', 'development'], confidence: 'high' },
  'gitlab.com': { type: 'webpage', defaultTags: ['code', 'development'], confidence: 'high' },
  'stackoverflow.com': { type: 'webpage', defaultTags: ['programming', 'help'], confidence: 'high' },
  'codepen.io': { type: 'webpage', defaultTags: ['code', 'demo'], confidence: 'high' },
  'codesandbox.io': { type: 'webpage', defaultTags: ['code', 'demo'], confidence: 'high' },
  'replit.com': { type: 'webpage', defaultTags: ['code', 'coding'], confidence: 'high' },
  
  // Content platforms
  'medium.com': { type: 'webpage', defaultTags: ['article', 'writing'], confidence: 'high' },
  'substack.com': { type: 'webpage', defaultTags: ['newsletter', 'writing'], confidence: 'high' },
  'notion.so': { type: 'document', defaultTags: ['productivity', 'notes'], confidence: 'high' },
  'obsidian.md': { type: 'document', defaultTags: ['notes', 'knowledge'], confidence: 'high' },
  'airtable.com': { type: 'document', defaultTags: ['database', 'productivity'], confidence: 'high' },
  
  // Business
  'linkedin.com': { type: 'webpage', defaultTags: ['business', 'networking'], confidence: 'high' },
  'crunchbase.com': { type: 'webpage', defaultTags: ['startup', 'funding'], confidence: 'high' },
  'producthunt.com': { type: 'webpage', defaultTags: ['startup', 'products'], confidence: 'high' },
  'ycombinator.com': { type: 'webpage', defaultTags: ['startup', 'ycombinator'], confidence: 'high' },
  
  // Shopping
  'amazon.com': { type: 'webpage', defaultTags: ['shopping', 'product'], confidence: 'high' },
  'etsy.com': { type: 'webpage', defaultTags: ['handmade', 'craft'], confidence: 'high' },
  'shopify.com': { type: 'webpage', defaultTags: ['ecommerce', 'business'], confidence: 'high' },
  
  // Learning
  'coursera.org': { type: 'webpage', defaultTags: ['education', 'course'], confidence: 'high' },
  'udemy.com': { type: 'webpage', defaultTags: ['education', 'course'], confidence: 'high' },
  'edx.org': { type: 'webpage', defaultTags: ['education', 'course'], confidence: 'high' },
  'khanacademy.org': { type: 'webpage', defaultTags: ['education', 'learning'], confidence: 'high' },
  
  // News/Info
  'wikipedia.org': { type: 'webpage', defaultTags: ['reference', 'learning'], confidence: 'high' },
  'reddit.com': { type: 'webpage', defaultTags: ['discussion', 'community'], confidence: 'high' },
  'news.ycombinator.com': { type: 'webpage', defaultTags: ['tech', 'news'], confidence: 'high' },
  
  // Documents
  'docs.google.com': { type: 'document', defaultTags: ['document', 'google'], confidence: 'high' },
  'drive.google.com': { type: 'document', defaultTags: ['file', 'google'], confidence: 'high' },
  'dropbox.com': { type: 'document', defaultTags: ['file', 'storage'], confidence: 'high' },
  
  // AI Tools
  'openai.com': { type: 'webpage', defaultTags: ['ai', 'tools'], confidence: 'high' },
  'anthropic.com': { type: 'webpage', defaultTags: ['ai', 'tools'], confidence: 'high' },
  'huggingface.co': { type: 'webpage', defaultTags: ['ai', 'machine-learning'], confidence: 'high' },
  'replicate.com': { type: 'webpage', defaultTags: ['ai', 'models'], confidence: 'high' },
}

// Detect resource type from URL patterns
function detectResourceTypeFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '').toLowerCase()
    const pathname = urlObj.pathname.toLowerCase()
    
    // Check domain rules first (most reliable)
    const domainRule = DOMAIN_RULES[domain]
    if (domainRule) {
      return domainRule.type
    }
    
    // Check file extensions
    if (pathname.includes('.pdf')) return 'pdf'
    if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image'
    if (pathname.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)) return 'video'
    if (pathname.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/i)) return 'document'
    
    // YouTube video detection
    if (domain.includes('youtube.com') && pathname.includes('/watch')) return 'video'
    if (domain.includes('youtu.be')) return 'video'
    
    // Google Docs detection
    if (domain.includes('docs.google.com')) return 'document'
    if (domain.includes('drive.google.com')) return 'document'
    
    return 'webpage' // default
  } catch {
    return 'webpage'
  }
}

// Extract suggested tags from URL and domain
function extractTagsFromUrl(url: string): string[] {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '').toLowerCase()
    const pathname = urlObj.pathname.toLowerCase()
    
    const tags: string[] = []
    
    // Domain-based tags
    const domainRule = DOMAIN_RULES[domain]
    if (domainRule) {
      tags.push(...domainRule.defaultTags)
    }
    
    // Path-based keyword detection
    const keywords = {
      'tutorial': ['tutorial', 'learning'],
      'guide': ['guide', 'how-to'],
      'blog': ['blog', 'article'],
      'tool': ['tool', 'utility'],
      'api': ['api', 'development'],
      'docs': ['documentation', 'reference'],
      'course': ['course', 'education'],
      'video': ['video', 'content'],
      'demo': ['demo', 'example'],
      'template': ['template', 'design']
    }
    
    Object.entries(keywords).forEach(([key, tagList]) => {
      if (pathname.includes(key)) {
        tags.push(...tagList)
      }
    })
    
    // Remove duplicates and limit to 4 tags
    return [...new Set(tags)].slice(0, 4)
  } catch {
    return []
  }
}

// Get confidence level for detection
function getDetectionConfidence(url: string): 'high' | 'medium' | 'low' {
  try {
    const domain = new URL(url).hostname.replace('www.', '').toLowerCase()
    const domainRule = DOMAIN_RULES[domain]
    
    if (domainRule) {
      return domainRule.confidence
    }
    
    // Check if it's a common file extension
    if (url.match(/\.(pdf|jpg|jpeg|png|gif|mp4|doc|docx)$/i)) {
      return 'medium'
    }
    
    return 'low'
  } catch {
    return 'low'
  }
}

// Main function to fetch URL metadata
export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    
    // Start with auto-detected data
    const autoDetected = {
      domain,
      resourceType: detectResourceTypeFromUrl(url),
      suggestedTags: extractTagsFromUrl(url),
      confidence: getDetectionConfidence(url)
    }
    
    // Try to fetch actual metadata from the page
    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      
      if (response.ok) {
        const metadata = await response.json()
        return {
          ...autoDetected,
          title: metadata.title || generateFallbackTitle(url),
          description: metadata.description || '',
          thumbnail: metadata.image || null,
          favicon: metadata.favicon || `${urlObj.origin}/favicon.ico`
        }
      }
    } catch (error) {
      console.log('Failed to fetch metadata, using auto-detection only')
    }
    
    // Fallback to auto-detection only
    return {
      ...autoDetected,
      title: generateFallbackTitle(url),
      description: '',
      thumbnail: null,
      favicon: `${urlObj.origin}/favicon.ico`
    }
    
  } catch (error) {
    throw new Error('Invalid URL provided')
  }
}

// Generate a reasonable title when we can't fetch it
function generateFallbackTitle(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    const pathname = urlObj.pathname
    
    // Try to extract from path
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1]
      const title = lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\.[^/.]+$/, '') // Remove file extension
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      if (title.length > 3) {
        return title
      }
    }
    
    // Fallback to domain
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
  } catch {
    return 'Web Resource'
  }
}

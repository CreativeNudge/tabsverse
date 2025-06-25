import { NextRequest, NextResponse } from 'next/server'

interface MetadataResponse {
  title?: string
  description?: string
  image?: string | null
  favicon?: string
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<MetadataResponse>> {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    
    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }
    
    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TabsverseBot/1.0)'
      },
      // Add timeout and size limits for safety
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch: ${response.status}` 
      }, { status: response.status })
    }
    
    // Check content type
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      // For non-HTML content, return basic info
      return NextResponse.json({
        title: extractTitleFromUrl(url),
        description: '',
        image: null,
        favicon: `${validUrl.origin}/favicon.ico`
      })
    }
    
    const html = await response.text()
    
    // Extract metadata using regex (simple but effective)
    const metadata: MetadataResponse = {
      title: extractTitle(html),
      description: extractDescription(html),
      image: extractImage(html, validUrl.origin),
      favicon: extractFavicon(html, validUrl.origin)
    }
    
    return NextResponse.json(metadata)
    
  } catch (error) {
    console.error('Metadata fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metadata' }, 
      { status: 500 }
    )
  }
}

function extractTitle(html: string): string {
  // Try og:title first
  const ogTitle = html.match(/<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']*)["\'][^>]*>/i)
  if (ogTitle && ogTitle[1]) {
    return cleanText(ogTitle[1])
  }
  
  // Try twitter:title
  const twitterTitle = html.match(/<meta\s+name=["\']twitter:title["\']\s+content=["\']([^"\']*)["\'][^>]*>/i)
  if (twitterTitle && twitterTitle[1]) {
    return cleanText(twitterTitle[1])
  }
  
  // Try regular title tag
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  if (title && title[1]) {
    return cleanText(title[1])
  }
  
  return ''
}

function extractDescription(html: string): string {
  // Try og:description first
  const ogDesc = html.match(/<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']*)["\'][^>]*>/i)
  if (ogDesc && ogDesc[1]) {
    return cleanText(ogDesc[1])
  }
  
  // Try twitter:description
  const twitterDesc = html.match(/<meta\s+name=["\']twitter:description["\']\s+content=["\']([^"\']*)["\'][^>]*>/i)
  if (twitterDesc && twitterDesc[1]) {
    return cleanText(twitterDesc[1])
  }
  
  // Try meta description
  const metaDesc = html.match(/<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\'][^>]*>/i)
  if (metaDesc && metaDesc[1]) {
    return cleanText(metaDesc[1])
  }
  
  return ''
}

function extractImage(html: string, origin: string): string | null {
  // Try og:image first
  const ogImage = html.match(/<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']*)["\'][^>]*>/i)
  if (ogImage && ogImage[1]) {
    return resolveUrl(ogImage[1], origin)
  }
  
  // Try twitter:image
  const twitterImage = html.match(/<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']*)["\'][^>]*>/i)
  if (twitterImage && twitterImage[1]) {
    return resolveUrl(twitterImage[1], origin)
  }
  
  // Try to find first img tag as fallback
  const firstImg = html.match(/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i)
  if (firstImg && firstImg[1]) {
    const imgSrc = resolveUrl(firstImg[1], origin)
    // Only use if it looks like a substantial image (not icons/logos)
    if (imgSrc && !imgSrc.includes('icon') && !imgSrc.includes('logo')) {
      return imgSrc
    }
  }
  
  return null
}

function extractFavicon(html: string, origin: string): string {
  // Try to find favicon link
  const faviconLink = html.match(/<link[^>]+rel=["\'][^"\']*icon[^"\']*["\']\s+href=["\']([^"\']*)["\'][^>]*>/i)
  if (faviconLink && faviconLink[1]) {
    return resolveUrl(faviconLink[1], origin)
  }
  
  // Fallback to default favicon location
  return `${origin}/favicon.ico`
}

function resolveUrl(url: string, origin: string): string {
  try {
    // If it's already absolute, return as-is
    if (url.startsWith('http')) {
      return url
    }
    
    // If it starts with //, add protocol
    if (url.startsWith('//')) {
      return `https:${url}`
    }
    
    // If it starts with /, it's relative to origin
    if (url.startsWith('/')) {
      return `${origin}${url}`
    }
    
    // Otherwise, relative to origin
    return `${origin}/${url}`
  } catch {
    return url
  }
}

function cleanText(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim()
}

function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1]
      return lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\.[^/.]+$/, '') // Remove file extension
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
  } catch {
    return 'Web Resource'
  }
}

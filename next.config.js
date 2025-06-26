/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'tabsverse.com', 'images.unsplash.com'],
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: 'qfkkywpzpklimtgdyyxi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // YouTube thumbnails and favicons
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',
        port: '',
        pathname: '/**',
      },
      // Social media platforms
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'instagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'twitter.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'x.com',
        port: '',
        pathname: '/**',
      },
      // Common website favicons and images
      {
        protocol: 'https',
        hostname: 'docs.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.github.com',
        port: '',
        pathname: '/**',
      },
      // News and media sites
      {
        protocol: 'https',
        hostname: 'www.wsj.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nytimes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cnn.com',
        port: '',
        pathname: '/**',
      },
      // Your other projects
      {
        protocol: 'https',
        hostname: 'www.mailcollectly.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mailcollectly.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.urlpixel.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'urlpixel.com',
        port: '',
        pathname: '/**',
      },
      // Catch-all for common favicon patterns
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/favicon.ico',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/favicon.png',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/favicon-*.png',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/favicon.ico',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'tabsverse.com']
    },
  },
  eslint: {
    // Only run ESLint on these directories during `next build`
    dirs: ['app', 'components', 'lib'],
    // Don't fail the build for warnings
    ignoreDuringBuilds: false
  },
  typescript: {
    // Don't fail the build for TypeScript errors in production
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig
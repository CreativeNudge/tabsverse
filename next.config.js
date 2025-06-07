/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'tabsverse.com', 'images.unsplash.com'],
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

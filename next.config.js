/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'tabsverse.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'tabsverse.com']
    },
  },
}

module.exports = nextConfig

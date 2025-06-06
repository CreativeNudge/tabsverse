/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'tabsverse.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'theswedishglow.com' },
    ],
  },
}

export default nextConfig

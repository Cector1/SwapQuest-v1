/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_PROJECT_ID: 'a1b2c3d4e5f6789012345678901234567890abcd',
    NEXT_PUBLIC_CHAIN_ID: '43113'
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  experimental: {
    // Optimizations for WorldCoin MiniApp
    optimizePackageImports: ['@worldcoin/minikit-js', '@worldcoin/minikit-react']
  },
  
  // Headers for WorldCoin MiniApp compatibility
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://worldcoin.org https://*.worldcoin.org"
          }
        ]
      }
    ]
  },

  // PWA-like features for better mobile experience
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest'
      }
    ]
  }
}

module.exports = nextConfig 
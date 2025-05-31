/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the app to be embedded in iframes (required for Arena platform)
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'self' https://*.arena.com https://arena.com"
        }
      ]
    }
  ],
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images for better performance
  images: {
    domains: ['localhost', 'arena.com'],
    unoptimized: false
  },
  
  // Environment variables
  env: {
    ARENA_SDK_VERSION: '1.0.0'
  }
};

export default nextConfig;

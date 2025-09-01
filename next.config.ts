/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable TypeScript checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
}

module.exports = nextConfig

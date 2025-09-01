/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/fortitude/:path*',
        destination: '/fortitude-app/:path*',
      },
      {
        source: '/fortitude',
        destination: '/fortitude-app',
      }
    ]
  }
}

export default nextConfig
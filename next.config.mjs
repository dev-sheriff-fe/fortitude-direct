/** @type {import('next').NextConfig} */
import { webpackFallback } from '@txnlab/use-wallet-react'
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
   webpack: (config, { isServer }) => {

    // Prevent errors from React Native imports in MetaMask SDK
    config.resolve.fallback = {
      ...config.resolve.fallback,

      '@react-native-async-storage/async-storage': false,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
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
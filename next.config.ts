import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains: [
      'mmcpdocs.s3.eu-west-2.amazonaws.com'
    ]
  },
  ...(process.env.NODE_ENV==='production' && {
    devIndicators: false,
   typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },

    compiler:{
      removeConsole:true
    }
  }),
   typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },

    devIndicators: false
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains: [
      'mmcpdocs.s3.eu-west-2.amazonaws.com'
    ]
  },
  devIndicators: false
};

export default nextConfig;

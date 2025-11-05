import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure API routes work on Netlify
  output: 'standalone',
  
  // Disable static optimization for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

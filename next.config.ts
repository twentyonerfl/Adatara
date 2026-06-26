import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    // Remove console.log in production to speed up client-side rendering
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    // Optimize bundle sizes by compiling only used imports for heavy libraries
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;

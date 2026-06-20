/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["motion", "gsap"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [],
  },
};

export default nextConfig;
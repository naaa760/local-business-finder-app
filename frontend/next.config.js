/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["maps.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
};

module.exports = nextConfig;

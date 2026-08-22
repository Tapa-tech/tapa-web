/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["swisseph", "@bidyashish/panchang"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

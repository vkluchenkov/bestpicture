/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.bestpicture.pro'],
  },
  output: 'standalone',
};

module.exports = nextConfig;

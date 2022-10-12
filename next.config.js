/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['wp.bestpicture.pro'],
  },
  output: 'standalone',
};

module.exports = nextConfig;

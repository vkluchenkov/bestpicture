/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["bestpicture.pro"],
  },
};

module.exports = nextConfig;

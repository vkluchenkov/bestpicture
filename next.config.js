/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.bestpicture.pro'],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/wp-admin',
  //       destination: 'https://test.bestpicture.pro/wp-admin/',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;

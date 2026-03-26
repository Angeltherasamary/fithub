/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/fithub',
  assetPrefix: '/fithub',
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "i.ytimg.com"],
  },
};

module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "i.ytimg.com"],
  },
};

module.exports = nextConfig;

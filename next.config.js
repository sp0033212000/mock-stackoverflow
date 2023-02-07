/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/rewrite/stackoverflow-api/:path*",
        destination: `${process.env.STACKOVERFLOW_API_URL}/:path*`,
        locale: false,
      },
    ];
  },
  env: {
    STACKOVERFLOW_API_URL: process.env.STACKOVERFLOW_API_URL,
    STACKOVERFLOW_KEY: process.env.STACKOVERFLOW_KEY,
  },
};

module.exports = nextConfig;

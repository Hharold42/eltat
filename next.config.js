/** @type {import('next').NextConfig} */
const nextConfig = {

  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };
    return config;
  },
};

module.exports = nextConfig;

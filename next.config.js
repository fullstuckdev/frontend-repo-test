/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add reflect-metadata to the bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "reflect-metadata": require.resolve("reflect-metadata"),
      };
    }
    return config;
  },
};

module.exports = nextConfig; 
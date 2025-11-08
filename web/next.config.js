/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  // Optimize for Vercel deployment
  swcMinify: true,
  // Handle external packages that might cause issues
  transpilePackages: ['@solana/web3.js', '@coral-xyz/anchor'],
  // Webpack config untuk handle node modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

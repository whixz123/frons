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
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        'supports-color': false,
      };
    }
    // Ignore node-specific modules
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
      'encoding': 'commonjs encoding',
      'supports-color': 'commonjs supports-color',
    });
    
    // Ignore warnings from specific modules
    config.ignoreWarnings = [
      { module: /node_modules\/engine\.io-client/ },
      { module: /node_modules\/socket\.io-client/ },
      { module: /node_modules\/@toruslabs/ },
    ];
    
    return config;
  },
};

module.exports = nextConfig;

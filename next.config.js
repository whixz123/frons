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
  // Add CSP headers for Solana/Web3 compatibility
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.solana.com https://*.helius-rpc.com https://*.rpcpool.com wss://*.solana.com https://api.devnet.solana.com https://api.mainnet-beta.solana.com https://vitals.vercel-insights.com",
              "worker-src 'self' blob:",
              "frame-src 'self' https://vercel.live",
            ].join('; ')
          },
        ],
      },
    ];
  },
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
      };
    }
    // Ignore node-specific modules
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
      'encoding': 'commonjs encoding',
    });
    
    return config;
  },
};

module.exports = nextConfig;

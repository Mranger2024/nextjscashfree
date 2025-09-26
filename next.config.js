/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Set the output file tracing root to the project directory to fix multiple lockfiles warning
  outputFileTracingRoot: path.join(__dirname),
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Output a standalone build that can be deployed without the Next.js server
  output: 'standalone',
  
  // Enable image optimization
  images: {
    domains: ['cashfree.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Configure environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
  
  // Turbopack configuration
  turbopack: {
    // Add any necessary Turbopack configuration here
  },
  
  // Configure webpack for production optimizations
  webpack(config, { dev, isServer }) {
    // Add TypeScript path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Only run this on the client-side build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Don't include fs module in client-side bundle
        net: false,
        tls: false,
        child_process: false,
        dns: false,
      };
    }

    // Add rule for TypeScript files
    config.module.rules.push({
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    });

    // Add rule for CSS modules
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
          },
        },
      ],
    });

    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking and chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          // Extract React and related packages into a separate chunk
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            chunks: 'all',
            priority: 40,
          },
        },
      };
    }
    
    return config;
  },
};

// For production builds, ensure we're using the correct environment
if (process.env.NODE_ENV === 'production') {
  // Ensure production environment variables are set
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.warn('Warning: NEXT_PUBLIC_BASE_URL is not set in production');
  }
}

module.exports = nextConfig;
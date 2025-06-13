/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/mary-prototype',
  images: {
    unoptimized: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This makes the deployment process smoother by ignoring TypeScript errors during build
    ignoreBuildErrors: true,
  },
  webpack(config) {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
}

// Use CommonJS module.exports for compatibility
module.exports = nextConfig 
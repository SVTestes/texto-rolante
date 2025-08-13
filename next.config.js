/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  poweredByHeader: false,
}

module.exports = nextConfig

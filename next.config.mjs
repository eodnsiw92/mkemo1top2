/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mkemo1top2',
  assetPrefix: '/mkemo1top2/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig;

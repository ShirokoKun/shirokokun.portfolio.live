/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: '**.substack.com' },
      { protocol: 'https', hostname: 'substackcdn.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/myspace', destination: '/?mode=personal', permanent: false },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost', 'api.qrserver.com'],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/services/:filename',
        destination: '/api/files/services/:filename',
      },
      {
        source: '/uploads/projects/:filename',
        destination: '/api/files/projects/:filename',
      },
      {
        source: '/uploads/videos/:filename',
        destination: '/api/files/videos/:filename',
      },
    ];
  },
};

export default nextConfig;

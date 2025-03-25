/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // Permite carregar imagens locais
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/whatsapp/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
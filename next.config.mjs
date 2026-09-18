/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep the legacy public URLs from reaching Next's public-file handler.
  // Fulfillment is available only from the authenticated node download route.
  async redirects() {
    return [
      {
        source: "/longevity-blueprint.pdf",
        destination: "/guides/longevity-blueprint",
        permanent: false,
      },
      {
        source: "/guides/longevity-blueprint.pdf",
        destination: "/guides/longevity-blueprint",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

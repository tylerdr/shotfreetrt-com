/** @type {import('next').NextConfig} */
const releaseSha = process.env.VERCEL_GIT_COMMIT_SHA ?? "local";
const copyContract = "decision-first-v1";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-ShotFreeTRT-Release", value: releaseSha },
          { key: "X-ShotFreeTRT-Copy-Contract", value: copyContract },
        ],
      },
    ];
  },
};

export default nextConfig;

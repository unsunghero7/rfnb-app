/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/:path*",
        has: [
          {
            type: "host",
            value: `(?<subdomain>.*).${process.env.NEXTAUTH_URL}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

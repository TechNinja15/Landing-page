/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTube lesson thumbnails
      },
    ],
  },
  // Course videos are embedded unlisted YouTube per the brief — no
  // custom video CDN config needed here.
};

export default nextConfig;

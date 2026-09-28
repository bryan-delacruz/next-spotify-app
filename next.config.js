/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Covers are served from Supabase Storage; any project ref is allowed.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

module.exports = nextConfig;

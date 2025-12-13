import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ESLint hataları build'i engellemesin (lint kontrolü için ayrı komut kullanılabilir)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hataları build'i engellemesin (tip kontrolü için ayrı komut kullanılabilir)
    ignoreBuildErrors: false, // TypeScript hataları önemli, bu false kalsın
  },
};

export default nextConfig;

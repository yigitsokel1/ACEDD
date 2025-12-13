import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ESLint hataları build'i engellemesin (lint komutu ile ayrı kontrol edilebilir)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hataları build'i engellemesin (tip kontrolü için ayrı komut kullanılabilir)
    ignoreBuildErrors: false, // TypeScript hataları önemli, bu false kalsın
  },
};

export default nextConfig;

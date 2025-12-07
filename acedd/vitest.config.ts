import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    // Use jsdom for React component tests, node for API tests
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
    setupFiles: ["./src/test/setup.ts"], // Setup file for test environment
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Override PostCSS config to prevent loading Tailwind CSS v4 plugin
  // Tailwind CSS v4 PostCSS plugin format is incompatible with Vitest
  css: {
    postcss: {
      plugins: [], // Empty plugins array disables PostCSS during tests
    },
  },
});


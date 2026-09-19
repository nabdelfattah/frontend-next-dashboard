import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */

  // Local environment: `/api/<feature>` is answered by the mock file
  // `public/api/<feature>.json`. Runs after the filesystem check, so a real
  // file or route handler at the same path still wins.
  async rewrites() {
    return {
      afterFiles: [{ source: "/api/:feature", destination: "/api/:feature.json" }],
    };
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
};

export default withNextIntl(nextConfig);

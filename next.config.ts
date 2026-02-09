import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-src https://challenges.cloudflare.com",
              "img-src 'self' blob: data: https://*.supabase.co",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Less strict CSP for API routes
        source: "/api/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'none'",
          },
        ],
      },
    ];
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Production source maps (for error tracking)
  productionBrowserSourceMaps: true,

  // Powered by header
  poweredByHeader: false,

  // Compress responses
  compress: true,
};

export default nextConfig;

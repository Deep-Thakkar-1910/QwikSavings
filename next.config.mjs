import path from "path";
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    // Add a rule for Handlebars files
    config.module.rules.push({
      test: /\.(handlebars|hbs)$/,
      use: [
        {
          loader: "handlebars-loader",
        },
      ],
    });
    config.resolve.alias["handlebars"] = "handlebars/dist/handlebars.js";

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "qwiksavings-prod-bucket.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

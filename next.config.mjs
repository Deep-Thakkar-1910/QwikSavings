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
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

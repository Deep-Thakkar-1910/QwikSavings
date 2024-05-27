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
    ],
  },
};

export default nextConfig;

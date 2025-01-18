import type { NextConfig } from "next";
const path = require('path')

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "@/styles/variables.module.scss";`,
  },
  images: {
    unoptimized: true, // Don't do the compress image quality
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    eslint: {
      ignoreDuringBuilds: true,
    }, typescript: true}

export default nextConfig;

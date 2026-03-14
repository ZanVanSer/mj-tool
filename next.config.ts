import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["mjml"],
  devIndicators: false,
};

export default nextConfig;

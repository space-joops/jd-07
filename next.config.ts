import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import packageJson from "./package.json";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  turbopack: {},
};

export default withSerwist(nextConfig);

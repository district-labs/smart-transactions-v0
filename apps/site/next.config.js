const withMDX = require("@next/mdx")()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.builder.io"],
    dangerouslyAllowSVG: true,
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push("pino-pretty", "lokijs", "encoding")
    return config
  },
  transpilePackages: [
    "@district-labs/intentify-core-react",
    "@district-labs/intentify-database",
  ],
}

module.exports = withMDX(nextConfig)

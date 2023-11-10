/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.builder.io"],
    dangerouslyAllowSVG: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push("pino-pretty", "lokijs", "encoding")
    return config
  },
  transpilePackages: [
    "@district-labs/intentify-api-actions",
    "@district-labs/intentify-core",
    "@district-labs/intentify-core-react",
    "@district-labs/intentify-database",
    "@district-labs/intentify-intent-batch",
    "@district-labs/intentify-intent-modules-react",
    "@district-labs/intentify-strategy-react",
    "@district-labs/ui-react"
  ],
}

module.exports = nextConfig

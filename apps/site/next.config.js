/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.builder.io", 'raw.githubusercontent.com', 'assets-cdn.trustwallet.com'],
    dangerouslyAllowSVG: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push("pino-pretty", "lokijs", "encoding")
    return config
  },
  transpilePackages: ["@district-labs/intentify-core-react", "@district-labs/intentify-database"],
}

module.exports = nextConfig

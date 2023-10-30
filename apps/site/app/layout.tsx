import { siteConfig } from "@/config/site"

import "@/styles/globals.css"

import type { Metadata } from "next"
import { env } from "@/env.mjs"
import RootProvider from "@/providers/root-providers"

import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import HandleWalletEvents from "@/components/blockchain/handle-wallet-events"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Investment Strategies",
    "Algorithmic Trading",
    "Crypto Investing",
    "Cryptocurrency",
    "Investing",
  ],
  authors: [
    {
      name: "District Labs",
      url: "https://districtlabs.com",
    },
  ],
  creator: "District Labs",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@district_labs",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <RootProvider>
          <HandleWalletEvents>{children}</HandleWalletEvents>
        </RootProvider>
        <TailwindIndicator />
        <Toaster />
      </body>
    </html>
  )
}

"use client"

import "@rainbow-me/rainbowkit/styles.css"

import { env } from "@/env.mjs"
import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { Provider as BalancerProvider } from "react-wrap-balancer"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { arbitrum, base, mainnet, optimism, polygon, zora } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import { TooltipProvider } from "@/components/ui/tooltip"

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [alchemyProvider({ apiKey: env.NEXT_PUBLIC_APP_URL }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: "District",
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_ID,
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})
interface RainbowProviderProps {
  children: React.ReactNode
}

export function RainbowProvider({ children }: RainbowProviderProps) {
  const { theme } = useTheme()

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={
          theme === "light"
            ? lightTheme({
                accentColor: "#047835",
                borderRadius: "small",
                fontStack: "system",
              })
            : darkTheme({
                accentColor: "#047835",
                borderRadius: "small",
                fontStack: "system",
              })
        }
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <BalancerProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </BalancerProvider>
    </NextThemesProvider>
  )
}

"use client"

import { env } from "@/env.mjs"

import "@rainbow-me/rainbowkit/styles.css"

import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { useTheme } from "next-themes"
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi"
import { goerli, optimism } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import { siteConfig } from "@/config/site"

interface Web3ProviderProps {
  children: React.ReactNode
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism, goerli],
  [alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_ID }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: siteConfig.name,
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_ID,
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export default function Web3Provider({ children }: Web3ProviderProps) {
  const { theme } = useTheme()
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={
          theme === "light"
            ? lightTheme({
                borderRadius: "small",
                fontStack: "system",
              })
            : darkTheme({
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

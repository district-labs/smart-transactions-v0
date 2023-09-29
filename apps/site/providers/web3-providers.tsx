"use client"
import "@rainbow-me/rainbowkit/styles.css"
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { useTheme } from "next-themes"
import { createConfig, WagmiConfig } from "wagmi"
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets"

import { siteConfig } from "@/config/site"

interface Web3ProviderProps {
  children: React.ReactNode
}

import { chains, publicClient, webSocketPublicClient } from "@/config/networks"
import HandleWalletEvents from "@/components/blockchain/handle-wallet-events"
import { env } from "@/env.mjs"

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ 
        projectId: env.NEXT_PUBLIC_WALLET_CONNECT_ID,
        chains 
      }),
      rainbowWallet({ 
        projectId: env.NEXT_PUBLIC_WALLET_CONNECT_ID,
        chains,
       }),
      coinbaseWallet({ chains, appName: siteConfig.name }),
      walletConnectWallet({ 
        projectId: env.NEXT_PUBLIC_WALLET_CONNECT_ID,
        chains }),
    ],
  },
])

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
        <HandleWalletEvents>

        {children}
        </HandleWalletEvents>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider as BalancerProvider } from "react-wrap-balancer"

import { TooltipProvider } from "@/components/ui/tooltip"

import Web3Provider from "./web3-providers"

interface RootProviderProps {
  children: React.ReactNode
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BalancerProvider>
        <TooltipProvider>
          <Web3Provider>{children}</Web3Provider>
        </TooltipProvider>
      </BalancerProvider>
    </NextThemesProvider>
  )
}

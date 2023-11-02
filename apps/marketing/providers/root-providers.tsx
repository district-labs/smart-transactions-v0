"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider as BalancerProvider } from "react-wrap-balancer"

import { TooltipProvider } from "@/components/ui/tooltip"

interface RootProviderProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <BalancerProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </BalancerProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NextThemesProvider>
  )
}

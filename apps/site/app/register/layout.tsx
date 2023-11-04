import StrategyContextProvider from "@/components/shared/canvas/strategy-context"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <StrategyContextProvider>{children}</StrategyContextProvider>
}

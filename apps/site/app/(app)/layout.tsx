import React from "react"

import MarketingFooter from "@/components/layouts/marketing-footer"
import MarketingHeader from "@/components/layouts/marketing-header"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex-1 py-10">{children}</main>
      <MarketingFooter />
    </div>
  )
}

import type { ReactNode } from "react"

import AppHeader from "@/components/layouts/app-header"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 px-4 md:px-6 lg:px-8 xl:px-10">{children}</main>
    </div>
  )
}

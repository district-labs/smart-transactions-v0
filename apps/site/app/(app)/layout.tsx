import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { getRequestCookie } from "@/lib/session"
import AppHeader from "@/components/layouts/app-header"

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const user = await getRequestCookie(cookies())

  // Send logged user to dashboard
  // if (!user?.siwe) {
  //   redirect("/login")
  // }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 px-4 md:px-6 lg:px-8 xl:px-10">{children}</main>
    </div>
  )
}

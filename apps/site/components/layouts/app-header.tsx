"use client"

import { cn } from "@/lib/utils"
import useScroll from "@/hooks/use-scroll"
import { ProfileButton } from "@/components/auth/profile-button"
import { Combobox } from "@/components/combobox"
import { AppNav } from "@/components/layouts/app-nav"
import MobileAppNav from "@/components/layouts/mobile-app-nav"

export default function AppHeader() {
  const scrolled = useScroll(0)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur transition-all",
        scrolled && "border-b bg-background/90"
      )}
    >
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10">
        <AppNav />
        <MobileAppNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Combobox />
            <ProfileButton />
          </nav>
        </div>
      </div>
    </header>
  )
}

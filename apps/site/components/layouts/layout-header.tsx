"use client"

import React from "react"
import { cn } from "@/lib/utils"
import useScroll from "@/hooks/use-scroll"
import { NavigationCore } from "@/components/layouts/navigation-core"
import { NavigationPanel } from "@/components/layouts/navigation-panel"

import { NavigationAccount } from "./navigation-account"

export default function Header() {
  const scrolled = useScroll(0)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur transition-all",
        scrolled && "border-b bg-background/90"
      )}
    >
      <div className=" flex h-16 items-center justify-between px-10 sm:flex-row">
        <div className="hidden flex-1 justify-end sm:flex sm:justify-start">
          <NavigationCore />
        </div>
        <div className="justify-end space-x-2 sm:flex">
          <NavigationAccount />
          <NavigationPanel />
        </div>
      </div>
    </header>
  )
}

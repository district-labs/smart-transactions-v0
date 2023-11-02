"use client"

import React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useScroll from "@/hooks/use-scroll"
import { NavigationCore } from "@/components/layouts/navigation-core"
import { NavigationPanel } from "@/components/layouts/navigation-panel"

import { Icons } from "../icons"
import { LinkComponent } from "../shared/link-component"
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
        <div className=" flex-1 justify-end sm:flex sm:justify-start">
          <LinkComponent href="/" className="flex items-center">
            <Icons.logo className="mr-2 h-8 w-8" />
            <span className="font-bold">{siteConfig.name}</span>
          </LinkComponent>
          <div className="hidden md:ml-6 md:inline-block">
            <NavigationCore />
          </div>
        </div>
        <div className="justify-end space-x-2 sm:flex">
          <NavigationAccount />
          <NavigationPanel />
        </div>
      </div>
    </header>
  )
}

"use client"

import React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import useScroll from "@/hooks/use-scroll"
import { NavigationCore } from "@/components/layouts/navigation-core"
import { NavigationPanel } from "@/components/layouts/navigation-panel"

import { IsDarkTheme } from "../shared/is-dark-theme"
import { IsLightTheme } from "../shared/is-light-theme"
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
        <div className="hidden justify-end sm:flex sm:flex-1 sm:justify-start">
          <NavigationCore />
        </div>
        <div className="flex sm:flex-1 sm:justify-center">
          <LinkComponent href="/">
            <IsDarkTheme>
              <Image
                alt="District Finance"
                src="/district-globe.svg"
                width={36}
                height={36}
              />
            </IsDarkTheme>
            <IsLightTheme>
              <Image
                alt="District Finance"
                src="/district-globe-dark.svg"
                width={36}
                height={36}
              />
            </IsLightTheme>
          </LinkComponent>
        </div>
        <div className="justify-end space-x-2 sm:flex sm:flex-1">
          <NavigationAccount />
          <NavigationPanel />
        </div>
      </div>
    </header>
  )
}

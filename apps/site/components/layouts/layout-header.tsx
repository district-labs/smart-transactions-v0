"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ButtonSIWELogout } from "@/integrations/siwe/components/button-siwe-logout"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"

import { cn } from "@/lib/utils"
import useScroll from "@/hooks/use-scroll"
import { NavigationCore } from "@/components/layouts/navigation-core"
import { NavigationPanel } from "@/components/layouts/navigation-panel"

import { WalletConnect } from "../blockchain/wallet-connect"
import { IsWalletConnected } from "../shared/is-wallet-connected"
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
        <div className="sm:flex flex-1 hidden justify-end sm:justify-start">
          <NavigationCore />
        </div>
        <Link href="/" className="flex flex-1 items-center space-x-2">
          <Image
            src="/images/auth-layout.webp"
            alt="District Labs Logo"
            width={45}
            height={45}
          />
        </Link>
        <div className="justify-end space-x-2 sm:flex">
          {/* <NavigationAccount /> */}
          <NavigationPanel />
        </div>
      </div>
    </header>
  )
}

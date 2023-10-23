"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ButtonSIWELogout } from "@/integrations/siwe/components/button-siwe-logout"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"

import { cn } from "@/lib/utils"
import useScroll from "@/hooks/use-scroll"
import { MarketingNav } from "@/components/layouts/marketing-nav"
import { MobileMarketingNav } from "@/components/layouts/mobile-marketing-nav"

import { WalletConnect } from "../blockchain/wallet-connect"
import { IsWalletConnected } from "../shared/is-wallet-connected"

export default function MarketingHeader() {
  const scrolled = useScroll(0)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur transition-all",
        scrolled && "border-b bg-background/90"
      )}
    >
      <div className=" flex h-16 flex-row-reverse items-center justify-between px-10 sm:flex-row">
        <div className="flex flex-1 justify-end sm:justify-start">
          <MarketingNav />
          <MobileMarketingNav />
        </div>
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/auth-layout.webp"
            alt="District Labs Logo"
            width={45}
            height={45}
          />
        </Link>
        <div className="hidden flex-1 justify-end space-x-2 sm:flex">
          <IsWalletConnected>
            <WalletConnect />
          </IsWalletConnected>
          <IsSignedIn>
            <ButtonSIWELogout />
          </IsSignedIn>
        </div>
      </div>
    </header>
  )
}

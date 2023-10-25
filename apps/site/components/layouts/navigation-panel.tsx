"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ButtonSIWELogout } from "@/integrations/siwe/components/button-siwe-logout"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { type MainNavItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

import { WalletConnect } from "../blockchain/wallet-connect"
import { IsWalletConnected } from "../shared/is-wallet-connected"

export function NavigationPanel() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Icons.menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-full max-w-xl">
        <div className="">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => setOpen(false)}
          >
            <Icons.logo className="h-10 w-10 text-primary" />
            <span className="inline-block text-xl font-bold uppercase">
              {siteConfig.name}
            </span>
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <div className="flex flex-col pl-1 pr-7">
          <Link
            href={"/account"}
            className="w-full border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Account
          </Link>
          <Link
            href={"/"}
            className="w-full border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Strategies
          </Link>
          <Link
            href={"/data-hub"}
            className="w-full border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Data Hub
          </Link>
          <Link
            href={siteConfig.links.discord}
            className="w-full border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Discord
          </Link>
        </div>
        {/* <IsWalletConnected>
          <WalletConnect />
        </IsWalletConnected> */}
        <IsSignedIn>
          <ButtonSIWELogout className="mt-4" />
        </IsSignedIn>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  children?: React.ReactNode
  href: string
  disabled?: boolean
  segment: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setIsOpen,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        href.includes(segment) && "text-foreground",
        disabled && "pointer-events-none opacity-60"
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  )
}

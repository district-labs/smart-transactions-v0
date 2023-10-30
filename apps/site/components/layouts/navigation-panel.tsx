"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ButtonSiweSignIn } from "@/integrations/siwe/components/button-siwe-sign-in"
import { ButtonSiweSignOut } from "@/integrations/siwe/components/button-siwe-sign-out"
import { IsSignedIn } from "@/integrations/siwe/components/is-signed-in"
import { IsSignedOut } from "@/integrations/siwe/components/is-signed-out"
import { DiscordLogoIcon } from "@radix-ui/react-icons"
import {
  CircleDollarSign,
  FileText,
  PersonStanding,
  UserCircle2,
  Wallet2,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

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
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            <UserCircle2 size={16} className="mr-1" />
            Account
          </Link>
          <Link
            href={"/account"}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            <Wallet2 size={16} className="mr-1" />
            Smart Wallet
          </Link>
          <Link
            href={"/"}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            <CircleDollarSign size={16} className="mr-1" /> Strategies
          </Link>
          <Link
            href={"/data-hub"}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            <FileText size={16} className="mr-1" /> Data Hub
          </Link>
          <Link
            href={siteConfig.links.discord}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            <DiscordLogoIcon className="mr-1" />
            Discord
          </Link>
        </div>
        <IsSignedOut>
          <ButtonSiweSignIn className="mt-4 w-full" />
        </IsSignedOut>
        <IsSignedIn>
          <ButtonSiweSignOut className="mt-4 w-full" />
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

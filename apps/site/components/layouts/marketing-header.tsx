"use client"

import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useScroll from "@/hooks/use-scroll"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MarketingNav } from "@/components/layouts/marketing-nav"
import { MobileMarketingNav } from "@/components/layouts/mobile-marketing-nav"

export default function MarketingHeader() {
  const scrolled = useScroll(0)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur transition-all",
        scrolled && "border-b bg-background/90"
      )}
    >
      <div className="container flex h-16 flex-row-reverse items-center justify-between sm:flex-row">
        <div className="flex flex-1 justify-end sm:justify-start">
          <MarketingNav items={siteConfig.marketingNav} />
          <MobileMarketingNav items={siteConfig.marketingNav} />
        </div>
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className=" h-10 w-10 stroke-primary text-primary" />
          <span className="inline-block text-xl font-bold uppercase">
            {siteConfig.name}
          </span>
        </Link>
        <div className="hidden flex-1 justify-end space-x-2 sm:flex">
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Log in
            <span className="sr-only">Sign In</span>
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Get started
            <span className="sr-only">Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

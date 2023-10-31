"use client"

import React, { useState } from "react"
import Link from "next/link"
import { DiscordLogoIcon } from "@radix-ui/react-icons"

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
            href={"/"}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Application
          </Link>
          <Link
            href={"/how-it-works"}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href={"/"}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Terms of Service
          </Link>
          <Link
            href={siteConfig.links.discord}
            className="flex w-full items-center border-b py-4 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Discord
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
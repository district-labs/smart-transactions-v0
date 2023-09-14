import { useState } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

export default function MobileAppNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-full">
        <div className="px-7">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2"
            onClick={() => setOpen(false)}
          >
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="inline-block text-base font-bold uppercase">
              {siteConfig.name}
            </span>
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col pl-1 pr-7">
            <Link
              href="/dashboard"
              className="w-full border-b py-4 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/strategies"
              className="w-full border-b py-4 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Strategies
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

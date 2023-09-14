import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function AppNav() {
  return (
    <div className="hidden gap-6 md:flex">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className=" h-8 w-8" />
        <span className="inline-block text-base font-bold uppercase">
          {siteConfig.name}
        </span>
      </Link>
      <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
        Dashboard
      </Link>
      <Link href="/strategies" className={buttonVariants({ variant: "ghost" })}>
        Strategies
      </Link>
    </div>
  )
}

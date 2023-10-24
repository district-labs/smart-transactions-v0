import Link from "next/link"
import { TwitterLogoIcon } from "@radix-ui/react-icons"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between py-8 md:flex-row">
        <Link href="/" className="flex items-center">
          <Icons.logo className="mr-2 h-8 w-8" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center space-x-6 md:order-2">
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-accent-foreground"
          >
            <span className="sr-only">Twitter</span>
            <TwitterLogoIcon className="h-5 w-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

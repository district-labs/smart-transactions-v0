import Link from "next/link"
import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

import { LinkComponent } from "../shared/link-component"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between py-8 md:flex-row">
        <div className="flex items-center gap-x-6">
          <Link href="/" className="flex items-center">
            <Icons.logo className="mr-2 h-8 w-8" />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          <Link href="/terms-of-service" className="text-xs">
            Terms of Service
          </Link>
        </div>
        <div className="flex items-center space-x-6 md:order-2">
          <LinkComponent
            href={siteConfig.links.docs}
            className="text-muted-foreground hover:text-accent-foreground"
          >
            Documentation
          </LinkComponent>
          <LinkComponent
            href={siteConfig.links.discord}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-accent-foreground"
          >
            <span className="sr-only">Discord</span>
            <DiscordLogoIcon className="h-5 w-5" />
          </LinkComponent>
          <LinkComponent
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-accent-foreground"
          >
            <span className="sr-only">Twitter</span>
            <TwitterLogoIcon className="h-5 w-5" />
          </LinkComponent>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@district-labs/ui-react"
import { Wallet2 } from "lucide-react"

import { siteConfig } from "@/config/site"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavigationAccount() {
  return (
    <div className="mr-4 hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={siteConfig.links.app} legacyBehavior passHref>
              <Button>Application</Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

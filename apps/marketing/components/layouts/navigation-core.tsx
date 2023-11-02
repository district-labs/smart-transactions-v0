import React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavigationCore() {
  return (
    <div className="mr-4 hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href={"/how-it-works"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                How It Works
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <Link href={"/research"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Research
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

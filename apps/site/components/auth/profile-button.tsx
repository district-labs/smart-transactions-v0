"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { type User } from "@/db/schema"
import {
  ConnectButton,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogInButton } from "@/components/auth/login-button"
import { Icons } from "@/components/icons"

export function ProfileButton() {
  const { isConnected } = useAccount()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()

  const [state, setState] = useState<{
    user?: User
    error?: Error
    loading?: boolean
  }>({})

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/user")
        const json = await res.json()
        setState((x) => ({
          ...x,
          user: json.user,
        }))
      } catch (_error) {}
    }
    // 1. page loads
    handler()

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler)
    return () => window.removeEventListener("focus", handler)
  }, [])

  if (isConnected) {
    return (
      <div>
        {state.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  {state.user.firstName && state.user.lastName && (
                    <AvatarFallback>
                      {`${state.user?.firstName.charAt(0) ?? ""}${
                        state.user.lastName.charAt(0) ?? ""
                      }`}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {state.user.firstName} {state.user.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {`${state.user.address.slice(
                      0,
                      6
                    )}...${state.user.address.slice(-4)}`}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {openAccountModal && (
                  <DropdownMenuItem onClick={openAccountModal}>
                    <Icons.user className="mr-2 h-4 w-4" />
                    Account
                    <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
                {openChainModal && (
                  <DropdownMenuItem onClick={openChainModal}>
                    <Icons.chain className="mr-2 h-4 w-4" />
                    Chain
                    <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Settings
                    <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/logout">
                  <Icons.logout className="mr-2 h-4 w-4" />
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <LogInButton />
        )}
      </div>
    )
  }

  return (
    <div>
      <ConnectButton />
    </div>
  )
}

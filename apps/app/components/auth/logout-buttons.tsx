"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useDisconnect } from "wagmi"

import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"

import { Icons } from "../icons"
import { Button, buttonVariants } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

export function LogOutButtons() {
  const router = useRouter()
  const mounted = useMounted()
  const [isPending, startTransition] = useTransition()
  const { disconnect } = useDisconnect({
    onSuccess(data) {
      console.log("Logged out: ", data)
      startTransition(() => {
        router.push(`${window.location.origin}/?redirect=false`)
      })
    },
  })

  return (
    <div className="flex w-full items-center space-x-2">
      {mounted ? (
        <Button
          size="sm"
          className="w-full"
          aria-label="Log out"
          onClick={() => disconnect()}
          disabled={isPending}
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Log out
        </Button>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full bg-muted text-muted-foreground"
          )}
        >
          Log out
        </Skeleton>
      )}
      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Go back
      </Button>
    </div>
  )
}

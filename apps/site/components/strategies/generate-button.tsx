"use client"

import { useTransition } from "react"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import {
  generateBearStrategy,
  generateStrategies,
} from "@/app/_actions/generate"

export function GenerateButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      className="h-8 px-2 lg:px-3"
      onClick={() => {
        startTransition(async () => {
          try {
            await generateBearStrategy()
            toast({ description: "Strategies generated successfully." })
          } catch (err) {
            catchError(err)
          }
        })
      }}
    >
      {isPending && (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      Generate Strategy
    </Button>
  )
}

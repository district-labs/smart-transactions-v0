"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { type Strategy } from "@/db/schema"

import { cn, isMacOs } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { useMounted } from "@/hooks/use-mounted"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
// import { filterStrategiesAction } from "@/app/_actions/strategy"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

// TAKE OUT SEARCH

export function Combobox() {
  const router = useRouter()
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)
  const [data, setData] = useState<
    | {
        category: Strategy["category"]
        strategies: Pick<Strategy, "id" | "name" | "category">[]
      }[]
    | null
  >(null)
  const [isPending, startTransition] = useTransition()

  // useEffect(() => {
  //   if (debouncedQuery.length === 0) setData(null)

  //   if (debouncedQuery.length > 0)
  //     [
  //       startTransition(async () => {
  //         const data = await filterStrategiesAction(debouncedQuery)
  //         setData(data)
  //       }),
  //     ]
  // }, [debouncedQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((isOpen) => !isOpen)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = useCallback((callback: () => unknown) => {
    setIsOpen(false)
    callback()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
    }
  }, [isOpen])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search strategies...</span>
        <span className="sr-only">Search strategies</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          {mounted && (
            <abbr title={isMacOs() ? "Command" : "Control"}>
              {isMacOs() ? "⌘" : "Ctrl+"}
            </abbr>
          )}
          K
        </kbd>
      </Button>
      <CommandDialog position="top" open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search strategies..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No strategies found.
          </CommandEmpty>
          {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            data?.map((group) => (
              <CommandGroup
                key={group.category}
                className="capitalize"
                heading={group.category}
              >
                {group.strategies.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      handleSelect(() => router.push(`/strategy/${item.id}`))
                    }
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

"use client"

import Link from "next/link"
import { type Strategy } from "@/db/schema"
import { type ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const columns: ColumnDef<Strategy>[] = [
  {
    accessorKey: "name",
    header: "Strategy name",
    cell: ({ row }) => {
      const strategy = row.original

      return (
        <div className="flex flex-col">
          <h4 className="font-bold">{row.getValue("name")}</h4>
          <p>{strategy.manager}</p>
          <div className="mt-2 flex items-center gap-2">
            <Button size="sm" className="h-6 px-4">
              Invest
            </Button>
            <Link
              href={`/strategy/${strategy.id}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-6 px-4"
              )}
            >
              Details
            </Link>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "assets",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Net assets (USD)
          <Icons.sort className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const assets = parseFloat(row.getValue("assets"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(assets)

      return formatted
    },
  },
]

"use client"

import { useMemo } from "react"
import Link from "next/link"
import { strategies, type Strategy } from "@/db/schema"
import { type ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { DataTable } from "../data-table/data-table"
import { DataTableColumnHeader } from "../data-table/data-table-column-header"
import { Badge } from "../ui/badge"
import { Button, buttonVariants } from "../ui/button"

interface StrategiesTableShellProps {
  data: Strategy[]
  pageCount: number
  managerId: number
}

export function StrategiesTableShell({
  data,
  pageCount,
  managerId,
}: StrategiesTableShellProps) {
  // Memoize the columns so they don't re-render
  const columns = useMemo<ColumnDef<Strategy, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Strategy Name" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <h4 className="font-bold">{row.getValue("name")}</h4>
              <p>{row.original.managerId}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" className="h-6 px-4">
                  Invest
                </Button>
                <Link
                  href={`/strategy/${row.original.id}`}
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
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => {
          const categories = Object.values(strategies.category.enumValues)
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const category = row.getValue("category") as Strategy["category"]

          if (!categories.includes(category)) return null

          return (
            <Badge variant="outline" className="capitalize">
              {category}
            </Badge>
          )
        },
      },
      {
        accessorKey: "assets",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Net Assets" />
        ),
      },
    ],
    [data, managerId]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
        {
          id: "category",
          title: "Category",
          options: strategies.category.enumValues.map((category) => ({
            label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
            value: category,
          })),
        },
      ]}
      searchableColumns={[
        {
          id: "name",
          title: "strategies",
        },
      ]}
      // newRowLink={`/strategy/create`}
    />
  )
}

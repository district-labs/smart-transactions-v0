"use client"

import { useQuery } from "@tanstack/react-query"

import { formatPrice } from "@/lib/utils"

export default function DashboardOverview() {
  const currentPriceQuery = useQuery({
    queryKey: ["tokenPrice"],
    queryFn: () =>
      fetch("/api/token/current-price", {
        method: "POST",
        body: JSON.stringify({
          coins: { chainId: 1, type: "native" },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  })

  return (
    <>
      <h2 className="text-2xl tracking-tight sm:text-3xl">Overview</h2>
      <div className="flex flex-col justify-between md:flex-row md:items-end">
        <dl className="mt-4 flex max-w-2xl gap-x-8 divide-x lg:mx-0 lg:max-w-none">
          <div className="flex flex-col gap-y-2">
            <dt className="text-sm leading-6">Current Balance</dt>
            <dd className="text-3xl font-semibold tracking-tight">$24,798</dd>
          </div>
          <div className="flex flex-col gap-y-2 pl-6">
            <dt className="text-sm leading-6">Return (chart value)</dt>
            <dd className="text-3xl font-semibold tracking-tight">
              {currentPriceQuery.isLoading ? (
                <div className="h-6 w-full animate-pulse bg-muted" />
              ) : (
                <>
                  {formatPrice(currentPriceQuery.data, {
                    notation: "standard",
                  })}
                </>
              )}
            </dd>
            <span>27.2%</span>
          </div>
        </dl>
      </div>
    </>
  )
}

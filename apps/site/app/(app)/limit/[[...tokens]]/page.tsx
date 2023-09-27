"use client"

import { useMemo } from "react"
import { redirect } from "next/navigation"

import { transformLimitOrderIntentQueryToLimitOrderData } from "@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data"
import { useGetIntentBatchFind } from "@/hooks/intent-batch/use-get-intent-batch-all"
import { defaultTokenList } from "@/components/blockchain/default-token-list"
import LimitOrderWidget from "@/components/blockchain/limit-order-widget"
import TokenPriceChart from "@/components/charts/token-price-chart"
import { UserLimitOrdersTable } from "@/components/user/user-limit-order-table"

import { defaultTokenIn, defaultTokenOut } from "../utils"

const tokenList = defaultTokenList[0]

export default function LimitOrderPage({
  params,
}: {
  params: { tokens: string[] | undefined }
}) {
  const outTokenSymbol = params?.tokens?.[0]?.toLowerCase()
  const inTokenSymbol =
    params?.tokens?.[1]?.toLowerCase() === outTokenSymbol
      ? undefined
      : params?.tokens?.[1]?.toLowerCase()

  const outToken = useMemo(
    () =>
      tokenList.tokens.find(
        (token) => token.symbol.toLowerCase() === outTokenSymbol
      ),
    [outTokenSymbol]
  )
  const inToken = useMemo(
    () =>
      tokenList.tokens.find(
        (token) => token.symbol.toLowerCase() === inTokenSymbol
      ),
    [inTokenSymbol]
  )

  if (!outToken || !inToken) {
    redirect(`/limit/${defaultTokenOut.symbol}/${defaultTokenIn.symbol}`)
  }

  const { data: intentBatchQuery, isSuccess } = useGetIntentBatchFind()
  return (
    <>
      <section className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <TokenPriceChart
            outToken={outToken || defaultTokenOut}
            inToken={inToken || defaultTokenIn}
          />
        </div>
        <LimitOrderWidget
          outToken={outToken || defaultTokenOut}
          inToken={inToken || defaultTokenIn}
        />
      </section>
      <section className="mt-10">
        {isSuccess && intentBatchQuery && intentBatchQuery.length > 0 && (
          <UserLimitOrdersTable
            pageCount={1}
            data={intentBatchQuery.map(
              transformLimitOrderIntentQueryToLimitOrderData
            )}
          />
        )}
      </section>
    </>
  )
}

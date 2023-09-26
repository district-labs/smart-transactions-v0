import { useMemo } from "react"
import { redirect } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultTokenList } from "@/components/blockchain/default-token-list"
import LimitOrderWidget from "@/components/blockchain/limit-order-widget"
import TokenPriceChart from "@/components/charts/token-price-chart"
import { OpenOrdersTableShell } from "@/components/strategies/limit-order-table-shell"

import { defaultTokenIn, defaultTokenOut } from "../utils"

const dummyData = [
  {
    sell: {
      asset: "Ether",
      amount: 2,
    },
    recieve: {
      asset: "USDC",
      amount: 4000,
    },
    limitPrice: "1000",
    expiry: "October 21, 2023",
    status: "open" as const,
  },
  {
    sell: {
      asset: "Ether",
      amount: 2,
    },
    recieve: {
      asset: "USDC",
      amount: 4000,
    },
    limitPrice: "1000",
    expiry: "October 21, 2023",
    status: "open" as const,
  },
]

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
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <OpenOrdersTableShell pageCount={1} data={dummyData} />
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}

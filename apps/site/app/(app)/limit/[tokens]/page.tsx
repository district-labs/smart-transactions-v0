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

export default function LimitOrderPage({
  params: { tokens },
}: {
  params: { tokens: string }
}) {
  const outToken = defaultTokenList[0].tokens.find(
    (token) => token.symbol === tokens.split("-")[0].toUpperCase()
  )
  const inToken = defaultTokenList[0].tokens.find(
    (token) => token.symbol === tokens.split("-")[1].toUpperCase()
  )

  return (
    <>
      <section className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <h2 className="text-2xl tracking-tight sm:text-3xl">ETH/USDC</h2>
          <TokenPriceChart />
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

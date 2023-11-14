"use client"

import { CardStrategyPreview } from "@/components/strategies/card-strategy-preview"
import { strategies } from "@/data/strategies"
import { getAuthUserApi } from "@district-labs/intentify-api-actions"
import Balancer from "react-wrap-balancer"

export default function Home() {
  const handleAPI = async () => {
  const user = await getAuthUserApi({
    expand: {emailPreferences:true}
  })
  console.log("user")
 console.log(user) 
  }
  return (
    <div className="relative space-y-4 overflow-hidden pb-20">
      <button className="p-4 bg-red-500 rounded-lg my-4" onClick={handleAPI}>
        Test API
      </button>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 px-6 pb-8 pt-6 text-center md:pb-12 md:pt-10 lg:px-8 lg:py-20"
      >
        <h1 className="text-3xl font-bold leading-tight tracking-normal md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Smart Transactions
        </h1>
        <Balancer className="my-2 max-w-3xl text-lg text-muted-foreground sm:text-xl">
          Interact with blockchains without the hassle
          <br />
          <span className="font-bold">
            Unlock the full power of Decentralized Finance
          </span>
        </Balancer>
      </section>
      <section className="h-full px-10 lg:px-20">
        <div className="max-w-screen-3xl mx-auto grid gap-10 text-left lg:grid-cols-3">
          {Object.values(strategies).map((strategy) => {
            return <CardStrategyPreview key={strategy.id} {...strategy} />
          })}
        </div>
      </section>
    </div>
  )
}

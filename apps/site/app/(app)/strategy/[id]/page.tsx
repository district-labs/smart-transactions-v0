"use client"

import { strategies } from "@/data/strategies"

import { StrategyTable } from "@/components/tables/strategy-table"

export default function Page({ params, searchParams }: any) {
  const selectedStrategy = Object.values(strategies).find((strategy: any) => {
    return strategy.id === params.id || strategy.alias === params.id
  })

  if (!selectedStrategy) {
    return <StrategyUnavailable />
  }

  const { name, description, IntentForm, id, tableColumns, transformData } =
    selectedStrategy

  return (
    <div className="overflow-hidden">
      <section className="relative mb-12">
        <div className="h-84 w-84 absolute bottom-0 left-0 right-0 top-0 z-0 mx-auto rounded-full bg-gradient-radial from-neutral-200 via-white to-transparent dark:from-neutral-700 dark:via-transparent dark:to-transparent"></div>
        <div className="container relative z-10 max-w-2xl">
          <h3 className="text-4xl font-extrabold">{name}</h3>
          <p className="mt-2 text-sm">{description}</p>
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-x-2">
              {/* <span className='text-xs'>Created By</span> */}
              <img
                src={selectedStrategy.createdBy.pfp}
                className="inline-block h-5 w-5 rounded-full"
              />
              <span className="">{selectedStrategy.createdBy.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold">Share Smart Transaction</span>
            </div>
          </div>
          <IntentForm strategyId={id} />
        </div>
      </section>

      <section className="bg-neutral-100 p-14 dark:bg-neutral-800 ">
        <div className="max-w-screen-4xl container">
          <div className="mb-7 text-center">
            <h3 className="text-xl font-extrabold">
              Active Smart Transactions
            </h3>
            <p className="mt-2 text-sm">
              View all smart transactions you've created for the{" "}
              <span className="font-bold">{name}</span> strategy.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md">
            <StrategyTable
              pageCount={10}
              strategyId={id}
              columns={tableColumns}
              transformData={transformData}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

const StrategyUnavailable = () => {
  return (
    <section className="p-1">
      <div className="container max-w-2xl text-center">
        <h3 className="text-4xl font-extrabold">Strategy Unavailable</h3>
        <p className="mt-4">
          The strategy you are looking for is not available at the moment.
        </p>
      </div>
    </section>
  )
}

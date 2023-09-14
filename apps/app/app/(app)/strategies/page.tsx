import { db } from "@/db"
import { strategies } from "@/db/schema"
import Balancer from "react-wrap-balancer"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function StrategiesPage() {
  const allStrategies = await db
    .select({
      id: strategies.id,
      name: strategies.name,
      description: strategies.description,
      manager: strategies.managerId,
      assets: strategies.assets,
    })
    .from(strategies)

  return (
    <>
      <div className="my-4 space-y-2">
        <h2 className="text-2xl tracking-tight sm:text-3xl">
          Investment Strategies
        </h2>
        <Balancer>
          Discover pre-built strategies you can invest in right away.
        </Balancer>
      </div>
      <DataTable columns={columns} data={allStrategies} />
    </>
  )
}

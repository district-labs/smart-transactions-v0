import { selectAllIntentBatchQuery } from "@/db/queries/intent-batch"

import { transformLimitOrderIntentQueryToLimitOrderData } from "@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data"
import { LimitOrdersTable } from "@/components/admin/limit-order-table"

import { IntentBatchTable } from "../../../components/admin/intent-batch-table"

export default async function AdminPage() {
  const intentBatch = await selectAllIntentBatchQuery.execute()
  return (
    <>
      <div className="container pt-10 lg:pt-20">
        <div className="flex justify-between">
          <h3 className="text-3xl font-extrabold">Admin</h3>
          <div className=""></div>
        </div>
      </div>
      <div className="container rounded-lg border-gray-100 bg-white p-10 shadow-sm lg:pb-14">
        <h3 className="mb-5 text-2xl font-semibold">Intent Batches</h3>
        <IntentBatchTable data={intentBatch} />
      </div>

      <div className="container mt-12 rounded-lg border-gray-100 bg-white p-10 shadow-sm lg:pb-14">
        <h3 className="mb-5 text-2xl font-semibold">
          Limit Orders (Parsed Intents Batches)
        </h3>
        <LimitOrdersTable
          pageCount={1}
          data={intentBatch.map(transformLimitOrderIntentQueryToLimitOrderData)}
        />
      </div>
    </>
  )
}

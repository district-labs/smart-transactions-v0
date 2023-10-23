"use client"
import { IntentBatchTable } from "../../../components/admin/intent-batch-table"
import { useIntentBatchGetAll } from "@/actions/use-get-intent-batch-all"

export default function AdminPage() {
  const intentBatch = useIntentBatchGetAll()
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
        <IntentBatchTable data={intentBatch.data} />
      </div>
    </>
  )
}

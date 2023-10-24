"use client"

import { useIntentBatchAdminGetAll } from "@/actions/admin/use-intent-batch-admin-get-all"

import { IntentBatchTable } from "../../../components/admin/intent-batch-table"

export default function AdminPage() {
  const intentBatch = useIntentBatchAdminGetAll()
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

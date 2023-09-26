import { selectAllIntentBatchQuery } from "@/db/queries/intent-batch"
import { IntentBatchTable } from "../../../components/admin/intent-batch-table"
import { transformLimitOrderIntentQueryToLimitOrderData } from "@/lib/transformations/transform-limit-order-intent-query-to-limit-order-data"
import { LimitOrdersTable } from "@/components/admin/limit-order-table"

export default async function AdminPage() {
  const intentBatch = await selectAllIntentBatchQuery.execute()
  return (
    <>
    <div className='container pt-10 lg:pt-20'>
      <div className='flex justify-between'>
        <h3 className='font-extrabold text-3xl'>Admin</h3>
        <div className=''>
          
        </div>
      </div>
    </div>
     <div className='container bg-white shadow-sm border-gray-100 rounded-lg p-10 lg:pb-14'>
      <h3 className='font-semibold text-2xl mb-5'>Intent Batches</h3>
      <IntentBatchTable data={intentBatch} />
     </div>

     <div className='container bg-white shadow-sm border-gray-100 rounded-lg p-10 lg:pb-14 mt-12'>
     <h3 className='font-semibold text-2xl mb-5'>Limit Orders (Parsed Intents Batches)</h3>
      <LimitOrdersTable pageCount={1} data={intentBatch.map(transformLimitOrderIntentQueryToLimitOrderData)} />
     </div>
    </>
  )
}

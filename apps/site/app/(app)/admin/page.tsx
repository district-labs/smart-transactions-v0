import { selectAllIntentBatchQuery } from "@/db/queries/intent-batch"
import { IntentBatchTable } from "./intent-batch-table"

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
      <IntentBatchTable data={intentBatch} />
     </div>
    </>
  )
}

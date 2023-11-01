import { useGetSafeAddress } from "@district-labs/intentify-core-react"
import type { IntentBatchQuery } from "@district-labs/intentify-database"
import { useQuery } from "@tanstack/react-query"

export function useGetIntentBatchFind() {
  const address = useGetSafeAddress()
  return useQuery({
    queryKey: ["intent-batch", "all", address],
    queryFn: async (): Promise<IntentBatchQuery[] | undefined> => {
      try {
        const res = await fetch(`/api/intent-batch/find?root=${address}`)
        const data = await res.json()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data
      } catch (error) {
        console.log(error, "error")
      }
    },
  })
}

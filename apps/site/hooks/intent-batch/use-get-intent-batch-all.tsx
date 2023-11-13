import { getIntentBatchesApi } from "@district-labs/intentify-api-actions"
import { useGetSafeAddress } from "@district-labs/intentify-core-react"
import { useQuery } from "@tanstack/react-query"

export function useGetIntentBatchFind() {
  const address = useGetSafeAddress()
  return useQuery({
    queryKey: ["intent-batch", "all", address],
    queryFn: async () => {
      try {
       
       const intentBatches = await  getIntentBatchesApi({
        root: address,
        expand: {
          intents: true,
        }
        
       })
       return intentBatches
      } catch (error) {
        console.log(error, "error")
      }
    },
  })
}

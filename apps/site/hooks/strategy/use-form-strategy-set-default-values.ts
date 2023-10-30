import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { hexToString } from "viem"

export function useFormStrategySetDefaultValues(defaultData: any) {
  const searchParams = useSearchParams()

  const [values, setValues] = useState()
  useEffect(() => {
    const intentBatchData = searchParams.get("intentBatchData")
    if (intentBatchData) {
      const shareData = JSON.parse(
        hexToString(intentBatchData as `0x${string}`)
      )
      setValues(shareData)
    } else {
      setValues(defaultData)
    }
  }, [defaultData, searchParams])

  return values
}

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { hexToString } from "viem"

export function useFormStrategySetDefaultValues(defaultData: any) {
  const { get } = useSearchParams()

  const [values, setValues] = useState()
  useEffect(() => {
    console.log("wtf")
    const intentBatchData = get("intentBatchData")
    if (intentBatchData) {
      const shareData = JSON.parse(
        hexToString(intentBatchData as `0x${string}`)
      )
      setValues(shareData)
    } else {
      setValues(defaultData)
    }
  }, [])

  return values
}

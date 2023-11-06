import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  decodeDimensionalNonce,
  decodeStandardNonce,
  decodeTimeNonce,
} from "@district-labs/intentify-core"
import { hexToString } from "viem"

export function useFormStrategySetDefaultValues(defaultData: any) {
  const { get } = useSearchParams()

  const [values, setValues] = useState()
  useEffect(() => {
    const intentBatchData = get("intentBatchData")
    if (intentBatchData) {
      const shareData = JSON.parse(
        hexToString(intentBatchData as `0x${string}`)
      )
      // if (shareData?.nonce) {
      //   let nonce = {}
      //   if (shareData?.nonce?.startsWith("0x00")) {
      //     const [accumulator] = decodeStandardNonce(shareData?.nonce)
      //     nonce = {
      //       type: "standard",
      //       args: [accumulator.toString()],
      //     }
      //   }
      //   if (shareData?.nonce?.startsWith("0x01")) {
      //     const [queue, accumulator] = decodeDimensionalNonce(shareData?.nonce)
      //     nonce = {
      //       type: "dimensional",
      //       args: [queue.toString(), accumulator.toString()],
      //     }
      //   }

      //   if (shareData?.nonce?.startsWith("0x02")) {
      //     const [id, delta, count] = decodeTimeNonce(shareData?.nonce)
      //     nonce = {
      //       type: "time",
      //       args: [id.toString(), delta.toString(), count.toString()],
      //     }
      //   }

      //   shareData = {
      //     ...shareData,
      //     nonce: nonce,
      //   }
      // }
      setValues(shareData)
    } else {
      setValues(defaultData)
    }
  }, [defaultData])

  return values
}

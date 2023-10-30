import { useIntentifySafeModuleGetDimensionalNonce, useIntentifySafeModuleGetStandardNonce } from "@district-labs/intentify-core-react"
import { useEffect } from "react"

type UseDynamicNonce = {
    address: `0x${string}` | undefined
    chainId: number | undefined
    root: `0x${string}` | undefined
    intentBatch: any,
    setIntentBatch: any,
    config: any
}
export function useDynamicNonce({address,  chainId, root, intentBatch, setIntentBatch, config}: UseDynamicNonce) {
    const { data: nonceStandardData, error: nonceStandardError } =
    useIntentifySafeModuleGetStandardNonce({
      address: address,
      chainId: chainId,
      args: [root],
      enabled: intentBatch.nonce.type === "standard",
    })

  const { data: nonceDimensionalData, error: nonceDimensionalError } =
    useIntentifySafeModuleGetDimensionalNonce({
      address: address,
      chainId: chainId,
      args: [root, intentBatch.nonce.args[0]],
      enabled: intentBatch.nonce.type === "dimensional",
    })

  useEffect(() => {
    if (
      intentBatch.nonce.type === "dimensional" &&
      config?.nonce?.dimensional?.defaultQueue
    ) {
      setIntentBatch((draft: any) => {
        draft["nonce"]["args"][0] = config?.nonce?.dimensional?.defaultQueue
      })
    }
  }, [intentBatch.nonce.type])

  return {
    standard: nonceStandardData,
    dimensional: nonceDimensionalData
  }
}
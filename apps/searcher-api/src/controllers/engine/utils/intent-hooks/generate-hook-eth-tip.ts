import type { Hook } from "@district-labs/intentify-core"

import { getSearcherAddressBychainId } from "../../../../constants"

interface EthTipIntentParams {
  chainId: number
}

export async function generateHookEthTipIntent({
  chainId,
}: EthTipIntentParams) {
  const hook: Hook = {
    // Recipient of the tip
    target: getSearcherAddressBychainId(chainId),
    data: "0x0",
    instructions: "0x0",
  }

  return hook
}

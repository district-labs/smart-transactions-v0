import { intentifySafeModuleABI } from "@district-labs/intentify-utils"
import { getContract } from "viem"

import { publicClients } from "./networks"

export function getIntentifySafeModule(chainId: number) {
  const publicClient = publicClients[chainId]
  if (!publicClient) throw new Error(`No client for chainId ${chainId}`)

  getContract({
    address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
    abi: intentifySafeModuleABI,
    publicClient,
  })
}

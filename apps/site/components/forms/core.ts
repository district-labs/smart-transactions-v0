/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { Abi } from "viem"

import { publicClients } from "@/app/api/engine/networks"

type IntentBundleExecutionParsed = {
  readonly address: `0x${string}`
  abi: Abi
  functionName: string
  args?: unknown[]
}

export const simulateMultipleIntentBundleWithMulticall = async (
  chainId: number,
  bundleBatch: IntentBundleExecutionParsed
) => {
  const publicClient = publicClients[chainId]
  if (!publicClient) throw new Error(`No client for chainId ${chainId}`)

  return await publicClient.multicall({
    // @ts-ignore
    contracts: bundleBatch,
  })
}

export const convertIntentBundleExecutionQueryToMulticall = () => {}

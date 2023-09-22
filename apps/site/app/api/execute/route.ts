/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import type { NextRequest } from "next/server"
import { newIntentExecutionBatch } from "@/db/queries/intent-batch-execution"
import {
  IntentifyBundlerAddressList,
  intentifySafeModuleBundlerABI,
} from "@district-labs/intentify-utils"
import { getContract } from "viem"

import { mainnetWalletClient } from "../blockchain-clients"

// eslint-disable-next-line @typescript-eslint/require-await
export async function POST(req: NextRequest) {
  const res = new Response()
  const { chainId, intentExecutionBundles } = req?.body

  let transactionHash: `0x${string}`

  switch (chainId) {
    case 1:
      const mainnetIntentModule = getContract({
        address: IntentifyBundlerAddressList[1],
        abi: intentifySafeModuleBundlerABI,
        walletClient: mainnetWalletClient,
      })
      for (
        let intentBun = 0;
        intentBun < intentExecutionBundles.length;
        intentBun++
      ) {
        const element = intentExecutionBundles[intentBun]
        newIntentExecutionBatch({
          intentBatchId: element.intentBatchId,
        })
      }
      transactionHash = await mainnetIntentModule.executeBundle(
        intentExecutionBundles
      )
      break
    case 5:
      const goerliIntentModule = getContract({
        address: IntentifyBundlerAddressList[5],
        abi: intentifySafeModuleBundlerABI,
        walletClient: mainnetWalletClient,
      })

      transactionHash = await goerliIntentModule.executeBundle(
        intentExecutionBundles
      )
      break
    default:
      throw new Error(`No client for chainId ${chainId}`)
    // TODO: Update database with executed intent bundles
    // updateIntentBundleExecutionStatus(intentBundleQuery, transactionHash)
  }

  console.log("Hello from Execute")
  return res.statusText("200")
}

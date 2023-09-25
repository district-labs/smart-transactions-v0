/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { newIntentExecutionBatch } from "@/db/queries/intent-batch-execution"
import {
  IntentifyBundlerAddressList,
  intentifySafeModuleBundlerABI,
} from "@district-labs/intentify-utils"
import { getContract } from "viem"

import { localWalletClient, mainnetWalletClient } from "../blockchain-clients"
import { IntentifyModuleAddressList } from "@district-labs/intentify-utils"

// eslint-disable-next-line @typescript-eslint/require-await
export async function POST(req: Request) {
  const { chainId, executableIntentBatchBundle } = await req.json()

  console.log(chainId, executableIntentBatchBundle)

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
        intentBun < executableIntentBatchBundle.length;
        intentBun++
      ) {
        const element = executableIntentBatchBundle[intentBun]
        newIntentExecutionBatch({
          intentBatchId: element.intentBatchId,
        })
      }
      transactionHash = await mainnetIntentModule.executeBundle(
        executableIntentBatchBundle
      )
      break
    case 5:
      const goerliIntentModule = getContract({
        address: IntentifyBundlerAddressList[5],
        abi: intentifySafeModuleBundlerABI,
        walletClient: mainnetWalletClient,
      })

      goerliIntentModule.write.executeBundle([executableIntentBatchBundle])

      // transactionHash = await goerliIntentModule.executeBundle(
      //   executableIntentBatchBundle
      // )
      break
    case 31337:
      console.log(IntentifyBundlerAddressList[31337])
      const localItentModule = getContract({
        address: IntentifyBundlerAddressList[31337],
        abi: intentifySafeModuleBundlerABI,
        walletClient: localWalletClient,
      })

      localItentModule.write.executeBundle([IntentifyModuleAddressList[31337], executableIntentBatchBundle], {
        gas: 569420n
      })

      break
    default:
      throw new Error(`No client for chainId ${chainId}`)
    // TODO: Update database with executed intent bundles
    // updateIntentBundleExecutionStatus(intentBundleQuery, transactionHash)
  }

  console.log("Hello from Execute")
  return new Response({ok: true})
}

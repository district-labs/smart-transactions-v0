import type { Hook } from "@district-labs/intentify-core"
import type { DbIntent } from "@district-labs/intentify-database"
import { type Address, type PublicClient } from "viem"

import { intentArgsToObj } from ".."
import { generateHookErc20Swap } from "./utils/generate-hook-erc20-swap"
import { erc20LimitOrderIntentArgsSchema } from "./validations"

interface GenerateHookErc20LimitOrderIntentParams {
  chainId: number
  intent: DbIntent
  publicClient: PublicClient
}

export async function generateHookErc20LimitOrderIntent({
  chainId,
  intent,
  publicClient,
}: GenerateHookErc20LimitOrderIntentParams): Promise<Hook> {
  const inputs = intentArgsToObj(intent.intentArgs)

  const { tokenIn, tokenOut, amountInMin, amountOutMax } =
    erc20LimitOrderIntentArgsSchema.parse(inputs)

  const hook = generateHookErc20Swap({
    chainId,
    publicClient,
    tokenIn: tokenIn as Address,
    tokenOut: tokenOut as Address,
    amountIn: BigInt(amountInMin),
    amountOut: BigInt(amountOutMax),
    intentRoot: intent.root as Address,
  })

  return hook
}

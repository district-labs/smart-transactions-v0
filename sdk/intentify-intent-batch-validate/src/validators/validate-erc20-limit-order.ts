import { erc20ABI } from "@district-labs/intentify-abi-external"
import { erc20LimitOrder } from "@district-labs/intentify-intent-batch"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../types"

export type ValidateErc20LimitOrderArgs = {
  root: Address
}

export async function validateErc20LimitOrder(
  data: `0x${string}`,
  args: ValidateErc20LimitOrderArgs,
  publicClient: PublicClient
): Promise<ValidationResponse> {
  const decodedData = decodeAbiParameters(erc20LimitOrder.args, data) as [`0x${string}`, `0x${string}`, bigint, bigint]

  const dataBalanceTokenOut = await publicClient.readContract({
    address: decodedData[0],
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [args.root],
  })

  if (!dataBalanceTokenOut || typeof dataBalanceTokenOut !== "bigint") {
    return {
      status: false,
      errors: [
        {
          index: -1,
          msg: `balanceOf returned null`,
        },
      ],
    }
  }

  if (decodedData[2] <= dataBalanceTokenOut) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedData[2] > dataBalanceTokenOut) {
    reasons.push({
      index: 2,
      msg: `amountOut is ${decodedData[2]} but balanceOf is ${dataBalanceTokenOut}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

export { erc20LimitOrder }

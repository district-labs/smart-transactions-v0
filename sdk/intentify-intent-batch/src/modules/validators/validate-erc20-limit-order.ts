import { erc20ABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { Erc20LimitOrderIntentEncodeABI } from "../erc20-limit-order"

export type ValidateErc20LimitOrderArgs = {
  root: Address
  publicClient: PublicClient
}

export async function validateErc20LimitOrder(
  abi: Erc20LimitOrderIntentEncodeABI,
  data: `0x${string}`,
  args: ValidateErc20LimitOrderArgs
): Promise<ValidationResponse> {
  const decodedData = decodeAbiParameters(abi, data)

  const dataBalanceTokenOut = (await args?.publicClient.readContract({
    address: decodedData[0],
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [args.root],
  })) as bigint | null

  if (dataBalanceTokenOut === null) {
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

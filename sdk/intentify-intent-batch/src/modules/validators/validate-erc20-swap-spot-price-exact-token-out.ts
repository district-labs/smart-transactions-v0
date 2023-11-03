import { erc20ABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { Erc20SwapSpotPriceExactTokenOutIntentEncodeABI } from "../erc20-swap-spot-price-exact-token-out"

export type ValidateErc20SwapSpotPriceExactTokenOutArgs = {
  root: Address
  publicClient: PublicClient
}

export async function validateErc20SwapSpotPriceExactTokenOut(
  abi: Erc20SwapSpotPriceExactTokenOutIntentEncodeABI,
  data: `0x${string}`,
  args: ValidateErc20SwapSpotPriceExactTokenOutArgs
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

  if (decodedData[4] <= dataBalanceTokenOut) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedData[4] > dataBalanceTokenOut) {
    reasons.push({
      index: 2,
      msg: `amountOut is ${decodedData[4]} but balanceOf is ${dataBalanceTokenOut}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

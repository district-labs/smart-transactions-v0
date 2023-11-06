import { erc20ABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { Erc20SwapSpotPriceBalanceTokenOutIntentEncodeABI } from "../erc20-swap-spot-price-balance-token-out"

export type ValidateErc20SwapSpotPriceBalanceTokenOutArgs = {
  root: Address
  publicClient: PublicClient
}

export async function validateErc20SwapSpotPriceBalanceTokenOut(
  abi: Erc20SwapSpotPriceBalanceTokenOutIntentEncodeABI,
  data: `0x${string}`,
  args: ValidateErc20SwapSpotPriceBalanceTokenOutArgs
): Promise<ValidationResponse> {
  const decodedData = decodeAbiParameters(abi, data)

  const dataTokenOutBalance = (await args?.publicClient.readContract({
    address: decodedData[0],
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [args.root],
  })) as bigint | null

  if (dataTokenOutBalance === null) {
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

  const minBalance = BigInt(decodedData[1])
  const balanceDelta = BigInt(decodedData[2])
  const floor = minBalance + balanceDelta

  if (dataTokenOutBalance >= floor) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (dataTokenOutBalance < floor) {
    reasons.push({
      index: 0, // use index 0 because that is the input to fetch intent data
      msg: `amountOut is ${decodedData[4]} but balanceOf is ${dataTokenOutBalance}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

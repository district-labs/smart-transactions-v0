import { erc20ABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { Erc20TransferIntentEncodeABI } from "../erc20-transfer"

export type ValidateErc20TransferArgs = {
  root: Address
  publicClient: PublicClient
}

export async function validateErc20Transfer(
  abi: Erc20TransferIntentEncodeABI,
  data: `0x${string}`,
  args: ValidateErc20TransferArgs
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

  if (decodedData[1] <= dataBalanceTokenOut) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedData[1] > dataBalanceTokenOut) {
    reasons.push({
      index: 1,
      msg: `amountOut is ${decodedData[2]} but balanceOf is ${dataBalanceTokenOut}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

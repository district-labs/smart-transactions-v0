import { erc20ABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"
import { type AbiParameter } from 'abitype'
import { ValidationResponse } from "../types"

export type ValidateErc20LimitOrderArgs = {
  root: Address
  publicClient: PublicClient
}

export async function validateErc20LimitOrder(
  abi: AbiParameter[],
  data: `0x${string}`,
  args: ValidateErc20LimitOrderArgs,
): Promise<ValidationResponse> {
  const decodedData = decodeAbiParameters(abi, data) as [
    `0x${string}`,
    `0x${string}`,
    bigint,
    bigint,
  ]

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
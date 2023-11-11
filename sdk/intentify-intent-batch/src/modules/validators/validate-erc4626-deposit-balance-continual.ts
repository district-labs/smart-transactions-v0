import { erc20ABI, erc4626ABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { Erc4626DepositBalanceContinualIntentEncodeABI } from "../erc4626-deposit-balance-continual"

export type ValidateErc4626DepositBalanceContinualArgs = {
  root: Address
  publicClient: PublicClient
}

export async function validateErc4626DepositBalanceContinual(
  abi: Erc4626DepositBalanceContinualIntentEncodeABI,
  data: `0x${string}`,
  args: ValidateErc4626DepositBalanceContinualArgs
): Promise<ValidationResponse> {
  const decodedData = decodeAbiParameters(abi, data)

  const tokenOut = await args?.publicClient.readContract({
    address: decodedData[0],
    abi: erc4626ABI,
    functionName: "asset",
  })

  const dataTokenOutBalance = (await args?.publicClient.readContract({
    address: tokenOut,
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
      index: 0,
      msg: `minimum amountOut is ${balanceDelta} and minimum balance of ${minBalance} but balanceOf is ${dataTokenOutBalance}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

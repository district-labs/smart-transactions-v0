import { erc20ABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { AaveV3SupplyBalanceContinualEncodeABI } from "../aavev3-supply-balance-continual"

export type ValidateAaveV3SupplyBalanceContinualArgs = {
  root: Address
  publicClient: PublicClient
}

export async function validateAaveV3SupplyBalanceContinual(
  abi: AaveV3SupplyBalanceContinualEncodeABI,
  data: `0x${string}`,
  args: ValidateAaveV3SupplyBalanceContinualArgs
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

  const minBalance = decodedData[1]
  const balanceDelta = decodedData[2]
  const floor = minBalance + balanceDelta

  if (dataTokenOutBalance >= floor) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (dataTokenOutBalance < floor) {
    reasons.push({
      index: 2,
      msg: `minimum amountOut is ${floor} but balanceOf is ${dataTokenOutBalance}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

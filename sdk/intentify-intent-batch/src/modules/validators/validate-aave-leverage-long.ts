import { aaveV3PoolABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Address, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { AaveLeverageLongIntentEncodeABI } from "../aave-leverage-long"

export type ValidateAaveLeverageLongArgs = {
  root: Address
  aaveV3Pool: Address
  publicClient: PublicClient
}

export async function validateAaveLeverageLong(
  abi: AaveLeverageLongIntentEncodeABI,
  data: `0x${string}`,
  args: ValidateAaveLeverageLongArgs
): Promise<ValidationResponse> {
  const decodedData = decodeAbiParameters(abi, data)

  const dataUserAccountData = await args.publicClient.readContract({
    address: args.aaveV3Pool,
    abi: aaveV3PoolABI,
    functionName: "getUserAccountData",
    args: [args.root],
  })

  const dataMinHealthFactor = dataUserAccountData[5]

  if (dataMinHealthFactor === null) {
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

  // Handle the case where the root does not have an Aave V3 account
  // The unique health factor value means the root does not have an Aave V3 account
  if (
    dataMinHealthFactor ===
    BigInt(
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    )
  ) {
    return {
      status: false,
      errors: [
        {
          index: -1,
          msg: `root does not have a Aave V3 account`,
        },
      ],
    }
  }

  if (decodedData[3] <= dataMinHealthFactor) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedData[3] < dataMinHealthFactor) {
    reasons.push({
      index: 2,
      msg: `minHealthFactor is ${decodedData[3]} but healthFactor is ${dataMinHealthFactor}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

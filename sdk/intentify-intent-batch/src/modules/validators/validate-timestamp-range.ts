import { type AbiParameter } from 'abitype'
import { decodeAbiParameters, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"

export type ValidateTimestampRangeArgs = {
  publicClient?: PublicClient
  currentTimestamp?: bigint
}

export async function validateTimestampRange(
  abi: AbiParameter[],
  data: `0x${string}`,
  args: ValidateTimestampRangeArgs
): Promise<ValidationResponse> {
  let currentTimestamp;
  if(args?.currentTimestamp) {
    currentTimestamp = args?.currentTimestamp
  } else if(args.publicClient) {
    const blockTimestamp = (await args.publicClient.getBlock()).timestamp
    currentTimestamp = BigInt(blockTimestamp)
  } else {
    throw new Error("Must provide either currentTimestamp or publicClient")
  }

  const decodedData = decodeAbiParameters(abi, data) as bigint[]
  if (
    decodedData[0] <= currentTimestamp &&
    decodedData[1] >= currentTimestamp
  ) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedData[0] > currentTimestamp) {
    reasons.push({
      index: 0,
      msg: `minTimestamp is ${decodedData[0]} but current timestamp is ${currentTimestamp}`,
    })
  }
  if (decodedData[1] < currentTimestamp) {
    reasons.push({
      index: 1,
      msg: `maxTimestamp is ${decodedData[1]} but current timestamp is ${currentTimestamp}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

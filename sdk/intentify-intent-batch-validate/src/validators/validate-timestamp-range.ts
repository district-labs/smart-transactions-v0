import { type AbiParameter } from 'abitype'
import { decodeAbiParameters } from "viem"

import { ValidationResponse } from "../types"

export type ValidateTimestampRangeArgs = {
  currentTimestamp: bigint
}

export function validateTimestampRange(
  abi: AbiParameter[],
  data: `0x${string}`,
  args: ValidateTimestampRangeArgs
): ValidationResponse {
  const decodedData = decodeAbiParameters(abi, data) as bigint[]
  if (
    decodedData[0] <= args.currentTimestamp &&
    decodedData[1] >= args.currentTimestamp
  ) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedData[0] > args.currentTimestamp) {
    reasons.push({
      index: 0,
      msg: `minTimestamp is ${decodedData[0]} but current timestamp is ${args.currentTimestamp}`,
    })
  }
  if (decodedData[1] < args.currentTimestamp) {
    reasons.push({
      index: 1,
      msg: `maxTimestamp is ${decodedData[1]} but current timestamp is ${args.currentTimestamp}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

import { blockNumberRange } from "@district-labs/intentify-intent-batch"
import { decodeAbiParameters } from "viem"

import { ValidationResponse } from "../types"

export type ValidateBlockNumberRangeArgs = {
  currentTimestamp: bigint
}

export function validateBlockNumberRange(
  data: `0x${string}`,
  args: ValidateBlockNumberRangeArgs
): ValidationResponse {
  const decodedData = decodeAbiParameters(blockNumberRange.args, data) as bigint[]
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
      msg: `minBlockNumber is ${decodedData[0]} but current blockNumber is ${args.currentTimestamp}`,
    })
  }
  if (decodedData[1] < args.currentTimestamp) {
    reasons.push({
      index: 1,
      msg: `maxBlockNumber is ${decodedData[1]} but current blockNumber is ${args.currentTimestamp}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

export { blockNumberRange }

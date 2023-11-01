import { decodeAbiParameters, type PublicClient } from "viem"
import { type AbiParameter } from 'abitype'
import { ValidationResponse } from "../../types"

export type ValidateBlockNumberRangeArgs = {
  currentBlockNumber?: bigint
  publicClient?: PublicClient
}

export async function validateBlockNumberRange(
  abi: AbiParameter[],
  data: `0x${string}`,
  args: ValidateBlockNumberRangeArgs
): Promise<ValidationResponse> {

  let currentBlockNumber;
  if(args.currentBlockNumber) {
    currentBlockNumber = args.currentBlockNumber
  } else if(args.publicClient) {
    const blockNumber = (await args.publicClient.getBlockNumber())
    currentBlockNumber = BigInt(blockNumber)
  } else {
    throw new Error("Must provide either currentTimestamp or publicClient")
  }

  const decodedData = decodeAbiParameters(
    abi,
    data
  ) as bigint[]
  if (
    decodedData[0] <= currentBlockNumber &&
    decodedData[1] >= currentBlockNumber
  ) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedData[0] > currentBlockNumber) {
    reasons.push({
      index: 0,
      msg: `minBlockNumber is ${decodedData[0]} but current blockNumber is ${currentBlockNumber}`,
    })
  }
  if (decodedData[1] < currentBlockNumber) {
    reasons.push({
      index: 1,
      msg: `maxBlockNumber is ${decodedData[1]} but current blockNumber is ${currentBlockNumber}`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}
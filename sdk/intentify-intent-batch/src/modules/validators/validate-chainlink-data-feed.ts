import { chainlinkDataFeedABI } from "@district-labs/intentify-abi-external"
import { decodeAbiParameters, type Hex, type PublicClient } from "viem"

import { ValidationResponse } from "../../types"
import type { ChainlinkDataFeedIntentEncodeABI } from "../chainlink-data-feed"

export type ValidateChainlinkDataFeedArgs = {
  dataFeedAnswer?: bigint
  dataFeedUpdatedAt?: bigint
  currentTimestamp?: bigint
  publicClient?: PublicClient
}

export async function validateChainlinkDataFeed(
  abi: ChainlinkDataFeedIntentEncodeABI,
  data: Hex,
  args: ValidateChainlinkDataFeedArgs
): Promise<ValidationResponse> {
  const [
    decodedDataFeedAddress,
    decodedMinValue,
    decodedMaxValue,
    decodedThresholdSeconds,
  ] = decodeAbiParameters(abi, data)

  const validateParams: {
    currentTimestamp?: bigint
    dataFeedAnswer?: bigint
    dataFeedUpdatedAt?: bigint
  } = {}

  if (args.currentTimestamp) {
    validateParams.currentTimestamp = args.currentTimestamp
  } else if (args.publicClient) {
    validateParams.currentTimestamp = (
      await args.publicClient.getBlock()
    ).timestamp
  } else {
    throw new Error("Must provide either currentTimestamp or publicClient")
  }

  if (args.dataFeedAnswer && args.dataFeedUpdatedAt) {
    validateParams.dataFeedAnswer = args.dataFeedAnswer
    validateParams.dataFeedUpdatedAt = args.dataFeedUpdatedAt
  } else if (args.publicClient) {
    const [
      ,
      // roundId
      answer, // startedAt
      ,
      updatedAt, // answeredInRound
      ,
    ] = await args.publicClient.readContract({
      abi: chainlinkDataFeedABI,
      address: decodedDataFeedAddress,
      functionName: "latestRoundData",
    })

    validateParams.dataFeedAnswer = answer
    validateParams.dataFeedUpdatedAt = updatedAt
  } else {
    throw new Error("Must provide either dataFeedValue or publicClient")
  }

  if (
    validateParams.dataFeedAnswer >= decodedMinValue &&
    validateParams.dataFeedAnswer <= decodedMaxValue &&
    validateParams.currentTimestamp <=
      validateParams.dataFeedUpdatedAt + decodedThresholdSeconds
  ) {
    return {
      status: true,
    }
  }

  let reasons = []
  if (decodedMinValue > validateParams.dataFeedAnswer) {
    reasons.push({
      index: 0,
      msg: `minValue is ${decodedMinValue} but dataFeedAnswer is ${validateParams.dataFeedAnswer}`,
    })
  }

  if (decodedMaxValue < validateParams.dataFeedAnswer) {
    reasons.push({
      index: 1,
      msg: `maxValue is ${decodedMaxValue} but dataFeedAnswer is ${validateParams.dataFeedAnswer}`,
    })
  }

  if (
    validateParams.currentTimestamp >
    validateParams.dataFeedUpdatedAt + decodedThresholdSeconds
  ) {
    reasons.push({
      index: 2,
      msg: `currentTimestamp is ${
        validateParams.currentTimestamp
      } but dataFeedUpdatedAt + thresholdSeconds is ${
        validateParams.dataFeedUpdatedAt + decodedThresholdSeconds
      }`,
    })
  }

  return {
    status: false,
    errors: reasons,
  }
}

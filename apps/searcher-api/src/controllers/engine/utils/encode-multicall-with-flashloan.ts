import { multiCallWithFlashLoanABI } from "@district-labs/intentify-core"
import {
  encodeAbiParameters,
  encodeFunctionData,
  getAbiItem,
  type Address,
} from "viem"

interface FlashLoanParams {
  tokens: Address[]
  amounts: bigint[]
}

type MultiCallParam = [Address, bigint, string]

interface EncodeMultiCallWithFlashLoanData {
  flashLoanParams: FlashLoanParams
  multiCallParams: MultiCallParam[]
}

export function encodeMultiCallWithFlashLoanData({
  flashLoanParams,
  multiCallParams,
}: EncodeMultiCallWithFlashLoanData) {
  const multiCallData = encodeAbiParameters(
    getAbiItem({
      abi: multiCallWithFlashLoanABI,
      name: "multiCall",
    }).inputs,
    multiCallParams
  )

  const multiCallWithFlashLoanData = encodeFunctionData({
    abi: multiCallWithFlashLoanABI,
    functionName: "flashLoan",
    args: [flashLoanParams.tokens, flashLoanParams.amounts, multiCallData],
  })

  return multiCallWithFlashLoanData
}

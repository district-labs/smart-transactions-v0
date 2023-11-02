import { Request, Response, NextFunction } from "express";
import { encodeFunctionData } from "viem"
import {
    IntentifyBundler,
    IntentifySafeModule,
} from "@district-labs/intentify-deployments"
import {
    intentifySafeModuleBundlerABI,
} from "@district-labs/intentify-core"
import { createContractArguments } from "./utils/create-contract-arguments"
import { ApiIntentBatchExecutionBundle } from "./validations/intent-batch-execution-bundle";
import { getRelayerByChainId } from "./utils/relayer";

const supportedChainIds = [5, 31337]
const GAS_LIMIT = BigInt(1000000)

export const executionIntentBatchExecutionBundleDispatch = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = await request.body
    const bodyData = ApiIntentBatchExecutionBundle.parse(body)
    const { chainId, executableIntentBatchBundle } = bodyData
    
    if (!supportedChainIds.includes(chainId)) {
        throw new Error(`ChainId ${chainId} not supported`)
    }

    const txdata = executableIntentBatchBundle.map(createContractArguments)    
    const data = encodeFunctionData({
        abi: intentifySafeModuleBundlerABI,
        functionName: "executeBundle",
        args: [IntentifySafeModule[chainId], txdata],
    })
    
    const { relayer } = getRelayerByChainId(chainId)
    const tx = await relayer.sendTransaction({
      to: IntentifyBundler[chainId],
      gasLimit: GAS_LIMIT.toString(),
      data,
      speed: "fast",
    })

    return response.status(200).json(JSON.stringify(tx))
  } catch (error) {
    next(error);
  }
};
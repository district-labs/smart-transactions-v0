import { intentifySafeModuleABI } from "@district-labs/intentify-core";
import { IntentifySafeModule } from "@district-labs/intentify-deployments";
import type { NextFunction, Request, Response } from "express";
import { encodeFunctionData } from "viem";
import { SUPPORTED_CHAINS } from "../../../../constants";
import { createContractArguments } from "./utils/create-contract-arguments";
import { getRelayerByChainId } from "./utils/relayer";
import { ApiIntentBatchExecutionSingle } from "./validations/intent-batch-execution-bundle";

const GAS_LIMIT = BigInt(1000000);

export const executionIntentBatchExecutionDispatch = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const body = await request.body;
    const bodyData = ApiIntentBatchExecutionSingle.parse(body);
    const { chainId, executableIntentBatch } = bodyData;

    if (!SUPPORTED_CHAINS.includes(chainId)) {
      throw new Error(`ChainId ${chainId} not supported`);
    }

    const txdata = createContractArguments(executableIntentBatch);
    const data = encodeFunctionData({
      abi: intentifySafeModuleABI,
      functionName: "execute",
      args: [txdata],
    });

    const { relayer } = getRelayerByChainId(chainId);
    const tx = await relayer.sendTransaction({
      to: IntentifySafeModule[chainId],
      gasLimit: GAS_LIMIT.toString(),
      data,
      speed: "fast",
    });

    return response.status(200).json(JSON.stringify(tx));
  } catch (error) {
    next(error);
  }
};

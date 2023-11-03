import type { IntentBatchExecution } from "@district-labs/intentify-core";
import {
  DBIntentBatchActiveItem,
  db,
  getSelectIntentBatchActiveQuery,
} from "@district-labs/intentify-database";
import { NextFunction, Request, Response } from "express";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { SUPPORTED_CHAINS } from "../../../constants";
import CustomError from "../../../utils/customError";
import { convertIntentBigIntToNumber } from "./utils/convert-intent-bigint-to-number";
import { generateIntentBatchExecutionWithHooksFromIntentBatchQuery } from "./utils/generate-intent-batch-execution-with-hooks-from-intent-batch-query";
import { simulateIntentBatchExecution } from "./utils/simulate-intent-bundles-execution";

const supportedChainIds = [5, 31337];

export const engineCalculateAndDispatch = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { chainId } = await request.query;

    if (!chainId && typeof chainId !== "number") {
      throw new CustomError("Missing or invalid chainId", 400);
    }

    if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
      throw new Error(`ChainId ${chainId} not supported`);
    }

    await calculateAndDispatch(31337);
    console.log("Hello from Intent Engine");

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
};

async function calculateAndDispatch(chainId: number) {
  const intentBatchExecutionQuery =
    await getSelectIntentBatchActiveQuery(db).execute();
  if (intentBatchExecutionQuery.length === 0) return;

  const intentBatchExecutionObjects = intentBatchExecutionQuery.map(
    (intentBatch: DBIntentBatchActiveItem) => {
      return generateIntentBatchExecutionWithHooksFromIntentBatchQuery(
        intentBatch,
      );
    },
  );
  if (intentBatchExecutionObjects.length === 0) return;

  // Find the executable intents.
  // We do this by simulating the execution of the intent batch on the
  // IntentifySafeModule contract. If the execution reverts, we know that the
  // intent is not executable.
  const executableIntentBatchBundle: IntentBatchExecution[] = [];

  for (let index = 0; index < intentBatchExecutionObjects.length; index++) {
    const eib = await intentBatchExecutionObjects[index];
    try {
      if (eib) {
        await simulateIntentBatchExecution(chainId, eib);
        // If the execution did not revert, we know that the intent is executable.
        // We add it to the list of executable intents.
        executableIntentBatchBundle.push(eib);
      }
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError?.data?.errorName ?? "";
          console.log(errorName);
        }
      }
    }
  }

  if (executableIntentBatchBundle.length === 0) return;

  const API_URL = process.env.API_EXECUTE_INTENT_BATCHES;
  if (!API_URL) {
    throw new Error("API_EXECUTE_INTENT_BATCHES env var not set");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chainId: chainId,
      executableIntentBatchBundle: executableIntentBatchBundle.map(
        convertIntentBigIntToNumber,
      ),
    }),
  });

  if (!res.ok) {
    console.error(res.statusText);
    return;
  }
}

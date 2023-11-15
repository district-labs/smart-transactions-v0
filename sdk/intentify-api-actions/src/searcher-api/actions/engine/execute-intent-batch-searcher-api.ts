import type { RelayerTransaction } from "@openzeppelin/defender-relay-client";
import { SEARCHER_API_URL } from "../../../constants";

interface ExecuteIntentBatchSearcherApiParams {
  intentBatchHash: string;
}

interface ExecuteIntentBatchSearcherApiResult {
    success: true;
    intentBatchHash: string;
    txReceipt: RelayerTransaction;
  
}

export async function executeIntentBatchSearcherApi({intentBatchHash}:ExecuteIntentBatchSearcherApiParams) {
  const response = await fetch(`${SEARCHER_API_URL}engine/${intentBatchHash}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: ExecuteIntentBatchSearcherApiResult = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}


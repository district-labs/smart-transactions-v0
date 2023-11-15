import type { RelayerTransaction } from "@openzeppelin/defender-relay-client";
import { SEARCHER_API_URL } from "../../../constants";

interface ExecuteIntentBatchesSearcherApiResult {
  successfulExecutions: {
    success: true;
    intentBatchHash: string;
    txReceipt: RelayerTransaction;
  }[];
  failedExecutions: {
    success: false;
    message: string;
    intentBatchHash: string;
  }[];
}

export async function executeIntentBatchesSearcherApi() {
  const response = await fetch(`${SEARCHER_API_URL}engine`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data: ExecuteIntentBatchesSearcherApiResult = await response.json();
    return data;
  }

  const errorData = await response.text();
  throw new Error(errorData);
}

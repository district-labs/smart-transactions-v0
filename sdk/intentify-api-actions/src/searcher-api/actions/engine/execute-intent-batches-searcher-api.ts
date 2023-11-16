import type { RelayerTransaction } from "@openzeppelin/defender-relay-client";

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

export async function executeIntentBatchesSearcherApi(searcherApiUrl: string) {
  const response = await fetch(`${searcherApiUrl}engine`, {
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

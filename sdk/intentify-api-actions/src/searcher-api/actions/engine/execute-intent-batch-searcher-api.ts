import type { RelayerTransaction } from "@openzeppelin/defender-relay-client";

interface ExecuteIntentBatchSearcherApiParams {
  intentBatchHash: string;
}

interface ExecuteIntentBatchSearcherApiResult {
  success: true;
  intentBatchHash: string;
  txReceipt: RelayerTransaction;
}

export async function executeIntentBatchSearcherApi(
  searcherApiUrl: string,
  { intentBatchHash }: ExecuteIntentBatchSearcherApiParams,
) {
  const response = await fetch(`${searcherApiUrl}engine/${intentBatchHash}`, {
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

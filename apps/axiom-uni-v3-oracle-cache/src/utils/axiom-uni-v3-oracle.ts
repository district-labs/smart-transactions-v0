import { uniswapV3TwapOracleABI } from "@district-labs/intentify-abi-external";
import { UniswapV3TwapOracle } from "@district-labs/intentify-deployments";
import { encodeFunctionData } from "viem";
import { goerliclient } from "../client";
import { CHAIN_ID } from "../constants";
import { getRelayerByChainId } from "../relayer";
import type { GetAxiomResponseResult } from "../types";



interface GetAxiomQueryResponseDataParams{keccakQueryResponse:string}

export async function getAxiomQueryResponseData({keccakQueryResponse}:GetAxiomQueryResponseDataParams){
   const response = await fetch(
    `${process.env.CORE_API_URL}service/axiom/get-query-result`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chainId: CHAIN_ID,
        keccakQueryResponse,
      }),
    },
  );

  if (!response.ok) {
    console.error("Error getting query result");
    throw new Error("Error getting query result");
  }

  const { responseData }: GetAxiomResponseResult = await response.json();

  return responseData
}

export async function checkIfAxiomQueryResponseDataIsMissingInUniV3Oracle({responseData}:GetAxiomResponseResult){
  // Loop through the storage responses and check if the uniV3TwapOracle already has a value for the slot,
  // otherwise store it
  let isStorageResponseMissing = false;
  await Promise.all(
    responseData.storageResponses.map(async ({ addr, blockNumber }) => {
      // Read pool, slot and block mappig from univ3TwapOracle
      try {
        await goerliclient.readContract({
          abi: uniswapV3TwapOracleABI,
          address: UniswapV3TwapOracle[CHAIN_ID],
          functionName: "getObservation",
          args: [addr as `0x${string}`, BigInt(blockNumber)],
        });
      } catch (error) {
        // If the slot does not exist, flag it to store
        isStorageResponseMissing = true;
        // Store the value in the contract if it does not exist
      }
    }),
  );

  return isStorageResponseMissing
  
}

export async function storeQueryResponseToUniV3Oracle({responseData}:GetAxiomResponseResult) {
  const txData = encodeFunctionData({
      abi: uniswapV3TwapOracleABI,
      functionName: "storeObservations",
      args: [
        {
          ...responseData,
          accountResponses: responseData.accountResponses.map(
            (accountResponse) => ({
              ...accountResponse,
              nonce: BigInt(accountResponse.nonce),
              balance: BigInt(accountResponse.balance),
            }),
          ),
          storageResponses: responseData.storageResponses.map(
            (storageResponse) => ({
              ...storageResponse,
              value: BigInt(storageResponse.value),
              slot: BigInt(storageResponse.slot),
            }),
          ),
        },
      ],
    });

    const relayer = getRelayerByChainId(CHAIN_ID);
    const txReceipt = await relayer.sendTransaction({
      gasLimit: 500000,
      speed: "fast",
      to: UniswapV3TwapOracle[CHAIN_ID],
      data: txData,
    });

    console.log("txReceipt", txReceipt)
    return txReceipt
  
}
import { ponder } from "@/generated";
import { uniswapV3TwapOracleABI } from "@district-labs/intentify-abi-external";
import { UniswapV3TwapOracle } from "@district-labs/intentify-deployments";
import { encodeFunctionData } from "viem";
import { goerliclient } from "./client";
import { getRelayerByChainId } from "./relayer";

const CHAIN_ID = 5 as const;

ponder.on("AxiomV1Query:QueryInitiatedOnchain", async ({ event, context }) => {
  // Only process events for the proof generator address
  // This cannot be implemented as a ponder filter because the event
  // parameters are not indexed
  if (event.params.refundee !== process.env.PROOF_GENERATION_ADDRESS) return;

  const { AxiomQuery } = context.entities;

  await AxiomQuery.create({
    id: event.params.keccakQueryResponse as `0x${string}`,
    data: {
      refundee: event.params.refundee,
      state: "INITIATED",
    },
  });
});

ponder.on("AxiomV1Query:QueryFulfilled", async ({ event, context }) => {
  const { AxiomQuery } = context.entities;
  const keccakQueryResponse = event.params.keccakQueryResponse as `0x${string}`;

  const query = await AxiomQuery.findUnique({
    id: keccakQueryResponse,
  });

  // Only update the query state if it was initiated by the proof generator
  if (!query) return;

  const response = await fetch(
    `${process.env.INTENTIFY_API_URL}/service/axiom/get-query-result`,
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
    return;
  }

  const {
    responseData,
  }: {
    responseData: {
      keccakBlockResponse: `0x${string}`;
      keccakAccountResponse: `0x${string}`;
      keccakStorageResponse: `0x${string}`;
      blockResponses: {
        blockNumber: number;
        blockHash: `0x${string}`;
        leafIdx: number;
        proof: [
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
        ];
      }[];
      accountResponses: {
        blockNumber: number;
        addr: `0x${string}`;
        nonce: `0x${string}`;
        balance: `0x${string}`;
        storageRoot: `0x${string}`;
        codeHash: `0x${string}`;
        leafIdx: number;
        proof: [
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
        ];
      }[];

      storageResponses: {
        blockNumber: number;
        addr: `0x${string}`;
        value: `0x${string}`;
        slot: number;
        leafIdx: number;
        proof: [
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
        ];
      }[];
    };
  } = await response.json();

  const relayer = getRelayerByChainId(CHAIN_ID);
  // Loop through the storage responses and check if the uniV3TwapOracle already has a value for the slot, otherwise store it

  let isAnyStorageResponseMissing = false;

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
        isAnyStorageResponseMissing = true;
        // Store the value in the contract if it does not exist
      }
    }),
  );

  if (isAnyStorageResponseMissing) {
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

    const txReceipt = await relayer.sendTransaction({
      gasLimit: 500000,
      speed: "fast",
      to: UniswapV3TwapOracle[CHAIN_ID],
      // 0.01 ETH
      data: txData,
    });
  }

  await AxiomQuery.update({
    id: keccakQueryResponse,
    data: {
      state: "FULFILLED",
    },
  });
});

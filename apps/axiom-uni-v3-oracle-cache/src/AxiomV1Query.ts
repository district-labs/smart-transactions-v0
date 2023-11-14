import { ponder } from "@/generated";
import { checkIfAxiomQueryResponseDataIsMissingInUniV3Oracle, getAxiomQueryResponseData, storeQueryResponseToUniV3Oracle } from "./utils/axiom-uni-v3-oracle";

// Triggered when a query is initiated onchain
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

// Triggered when a query is fulfilled onchain
ponder.on("AxiomV1Query:QueryFulfilled", async ({ event, context }) => {
  const { AxiomQuery } = context.entities;
  const keccakQueryResponse = event.params.keccakQueryResponse as `0x${string}`;

  const query = await AxiomQuery.findUnique({
    id: keccakQueryResponse,
  });


  // Only update the query state if it was initiated by the proof generator
  if (!query) return;

  const axiomQueryResponseData =await getAxiomQueryResponseData({ keccakQueryResponse });
  const isStorageResponseMissing =  await checkIfAxiomQueryResponseDataIsMissingInUniV3Oracle({responseData: axiomQueryResponseData})

  // Store the query response in the UniV3TwapOracle contract if it some query responses are missing
  if (isStorageResponseMissing) {
    await storeQueryResponseToUniV3Oracle({responseData: axiomQueryResponseData})
  }

  await AxiomQuery.update({
    id: keccakQueryResponse,
    data: {
      state: "FULFILLED",
    },
  });
});

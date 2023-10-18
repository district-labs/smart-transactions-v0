import { ponder } from "@/generated";

const PROOF_GENERATION_ADDRESS = "0xf84B4AbfcC1E062aa54D738f2ABE00c1B85090DF"

ponder.on("AxiomV1Query:QueryInitiatedOnchain", async ({event,context}) => {

  // Only process events for the proof generator address
  // This cannot be implemented as a ponder filter because the event
  // parameters are not indexed
  if(event.params.refundee !== PROOF_GENERATION_ADDRESS) return

  const {AxiomQuery } = context.entities

  await AxiomQuery.create({
    id: event.params.keccakQueryResponse as `0x${string}`,
    data: {
      refundee: event.params.refundee,
      state: "INITIATED",
    }
  })
})

ponder.on("AxiomV1Query:QueryFulfilled", async ({event,context}) => {
    const {AxiomQuery } = context.entities
  const keccakQueryResponse = event.params.keccakQueryResponse as `0x${string}`

    const query = await AxiomQuery.findUnique({
      id: keccakQueryResponse,
    })

    // Only update the query state if it was initiated by the proof generator
    if(!query) return

    await AxiomQuery.update({
     id: keccakQueryResponse,
  data: {
    state: "FULFILLED",
  }
    })
})

// TODO:
// - Filter events for query initiated only for defender address
// - Get all the events for query fulfilled
// - Update the query state to fulfilled
// - Check if an event exists for query failed or expired
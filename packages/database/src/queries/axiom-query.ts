import { db } from "..";

// ----------------------------------------
// Select Axiom Queries
// ----------------------------------------

export function getAxiomQueries({
  keccakQueryResponse
}: {
  keccakQueryResponse?: string
}={}) {
const selectAllIntentBatchQuery = db.query.axiomQuery.findMany({
 where: keccakQueryResponse ? (axiomQuery, {eq}) => eq(axiomQuery.keccakQueryResponse, keccakQueryResponse) : undefined
})

return selectAllIntentBatchQuery
}
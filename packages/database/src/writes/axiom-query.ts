import { axiomQuery, db, type DbNewAxiomQuery } from "..";

export function newAxiomQuery(
  newAxiomQuery: Omit<DbNewAxiomQuery, "id">
) {
  return db.insert(axiomQuery).values(newAxiomQuery)
}
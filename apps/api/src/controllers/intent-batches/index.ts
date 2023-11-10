import {
  db, eq, intentBatch
} from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";

// TODO: Add expand query to include related entities
export async function getIntentBatches(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const intentBatches = await db.query.intentBatch.findMany();

    return response.status(200).json({ data: intentBatches });
  } catch (error) {
    next(error);
  }
}

// TODO: Add expand query to include related entities
export async function getIntentBatch(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const intentBatchHash = request.params.id;

    if (!intentBatchHash) {
      return response.status(400).json({ error: "Invalid intent batch ID" });
    }

    const existingIntentBatch = await db.query.intentBatch.findFirst({
      where: eq(intentBatch.intentBatchHash, intentBatchHash),
    });
    
    if (!existingIntentBatch) {
      return response.status(404).json({ error: "Intent batch not found" });
    }
    
    return response.status(200).json({ data: existingIntentBatch });
  } catch (error) {
    next(error);
  }
}



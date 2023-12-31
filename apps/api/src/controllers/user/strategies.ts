import { Request, Response, NextFunction } from "express";
import { getStrategiesActiveFromDB } from "../../models/strategies";

export const getStrategiesActive = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const filters = request.query;
    if (!filters.root) {
      return response.status(400).json({ error: "Missing root parameter" });
    }
    const strategies = await getStrategiesActiveFromDB(filters.root as string);

    return response.status(200).json({ data: strategies });
  } catch (error) {
    next(error);
  }
};

import { generateIntentBatchEIP712 } from "@district-labs/intentify-core";
import { IntentifySafeModule } from "@district-labs/intentify-deployments";
import { NextFunction, Request, Response } from "express";
import { getIronSession } from "iron-session";
import { hashTypedData } from "viem";
import { SUPPORTED_CHAINS } from "../../constants";
import { intentBatchFactory } from "../../intent-batch-factory";
import { ironOptions } from "../../iron-session";
import {
  acceptTeamInvitationFromDB,
  addStrategyToTeamInDB,
  createInviteToTeamInDB,
  createTeamInDB,
  getTeamFromDB,
  getTeamInvitationFromDB,
  getTeamsFromDB,
} from "../../models/team";
import CustomError from "../../utils/customError";

/**
 * Handle request to retrieve all users.
 * Filters can be optionally applied to narrow down the result set.
 */
export const getTeams = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);

    if (!session.address) {
      return response.status(400).json({ error: "Missing root parameter" });
    }

    const teams = await getTeamsFromDB({
      user: session.address,
    });

    return response.status(200).json({ data: teams });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to retrieve a user by their ID.
 */
export const getTeamById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const teamId = request.params.id;
    if (!teamId) {
      throw new CustomError("Invalid Team ID", 400);
    }

    const Team = await getTeamFromDB(Number(teamId));

    return response.status(200).json({ data: Team });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to create a new user.
 */
export const createTeam = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    const { name, description } = request.body;
    const newTeam = await createTeamInDB({
      name,
      description,
      createdBy: session.address,
    });

    return response.status(200).json({ data: newTeam });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to create a new team strategy.
 */
export const createInviteToTeam = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    const { teamId, userId } = request.body;
    console.log(request.body);
    const newTeam = await createInviteToTeamInDB({
      teamId,
      userId,
    });
    return response.status(200).json({ data: newTeam });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to create a new team strategy.
 */
export const addStrategyToTeam = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    const { teamId, strategyId } = request.body;
    const newTeam = await addStrategyToTeamInDB({
      createdBy: session.address,
      teamId,
      strategyId,
    });
    return response.status(200).json({ data: newTeam });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to get a team invite.
 */
export const getTeamInvite = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    const teamId = request.params.teamId;
    const teamInvitation = await getTeamInvitationFromDB({
      teamId,
      userId: session.address,
    });
    return response.status(200).json({ data: teamInvitation });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle request to get a team invite.
 */
export const acceptTeamInvite = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    const teamId = request.params.teamId;
    const teamInvitation = await acceptTeamInvitationFromDB({
      teamId,
      userId: session.address,
    });
    return response.status(200).json({ data: teamInvitation });
  } catch (error) {
    next(error);
  }
};

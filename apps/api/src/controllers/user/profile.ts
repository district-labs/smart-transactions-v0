import { Request, Response, NextFunction } from "express";
import { getIronSession } from "iron-session";
import { ironOptions } from "../../iron-session";
import {
  db,
  emailPreferences,
  eq,
  users,
} from "@district-labs/intentify-database";

export const userProfileIsSignedIn = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    return response
      .status(200)
      .json({ address: session.address, isLoggedIn: !!session.address });
  } catch (error) {
    next(error);
  }
};

export const userProfileGet = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const session = await getIronSession(request, response, ironOptions);
    if (!session.address) {
      throw new Error("User session not found");
    }
    const user = await db.query.users.findFirst({
      where: eq(users.address, session.address),
      with: {
        emailPreferences: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return response.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const userProfileUpdate = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = await request.body;
    const session = await getIronSession(request, response, ironOptions);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, session.address),
    });

    if (existingUser) {
      await db
        .update(users)
        .set(data)
        .where(eq(users.address, session.address));
    } else {
      await db.insert(users).values(data);
    }

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const userEmailPreferencesUpdate = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = await request.body;
    const session = await getIronSession(request, response, ironOptions);

    await db
      .update(emailPreferences)
      .set({
        transactional: !!data.transactional,
        marketing: !!data.marketing,
        newsletter: !!data.newsletter,
      })
      .where(eq(emailPreferences.userId, session.address));

    return response.status(200).send();
  } catch (error) {
    next(error);
  }
};

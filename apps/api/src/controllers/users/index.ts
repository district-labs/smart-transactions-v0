import {
  db,
  emailPreferences,
  eq,
  users,
} from "@district-labs/intentify-database";
import type { NextFunction, Request, Response } from "express";
import { isAddress } from "viem";
import { z } from "zod";

const getUsersQuerySchema = z.object({
  expand: z.literal('emailPreferences').optional(),
})

export async function getUsers(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const expand = getUsersQuerySchema.parse(request.query).expand;

    const users = await db.query.users.findMany({
      with: {
        emailPreferences: expand=== "emailPreferences" ? true : undefined,
      },
    });

    return response.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
}

const getUserQuerySchema = z.object({
  expand: z.literal('emailPreferences').optional(),
})

export async function getUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const userAddress = request.params.address;
    const expand = getUserQuerySchema.parse(request.query).expand;

    if (!userAddress || !isAddress(userAddress)) {
      return response.status(400).json({ error: "Invalid user address" });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.address, userAddress),
      with: {
        emailPreferences: expand=== "emailPreferences" ? true : undefined,
      },
    });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

const postUserSchema = z.object({
  address: z.string().refine((value) => isAddress(value)),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  safeAddress: z.string().refine((value) => isAddress(value)),
  emailPreferences: z
    .object({
      newsletter: z.boolean(),
      marketing: z.boolean(),
      transactional: z.boolean(),
    })
    .optional(),
});

export async function postUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const newUserData = postUserSchema.parse(request.body);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, newUserData.address),
  });

  if (existingUser) {
    return response.status(409).json({ error: "User already exists" });
  }

  const newUser = await db.insert(users).values(newUserData);

  if (!newUser) {
    return response.status(500).json({ error: "Error creating user" });
  }

  // Create email preferences if they exist
  if (newUserData.emailPreferences) {
    const newEmailPreferences = await db.insert(emailPreferences).values({
      userId: newUserData.address,
      ...newUserData.emailPreferences,
    });

    if (!newEmailPreferences) {
      return response
        .status(500)
        .json({ error: "Error creating email preferences" });
    }
  }

  return response.status(201).json({ data: newUser });
}

const putUserSchema = z.object({
  address: z.string().refine((value) => isAddress(value)),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  emailPreferences: z
    .object({
      newsletter: z.boolean().optional(),
      marketing: z.boolean().optional(),
      transactional: z.boolean().optional(),
    })
    .optional(),
});

export async function putUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const updatedUserData = putUserSchema.parse(request.body);

  if (!updatedUserData.address || !isAddress(updatedUserData.address)) {
    return response.status(400).json({ error: "Invalid user address" });
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, updatedUserData.address),
  });

  if (!existingUser) {
    return response.status(404).json({ error: "User not found" });
  }

  const updatedUser = await db
    .update(users)
    .set(updatedUserData)
    .where(eq(users.address, updatedUserData.address));

  if (!updatedUser) {
    return response.status(500).json({ error: "Error updating user" });
  }

  // Update email preferences if they exist
  if (updatedUserData.emailPreferences) {
    const existingEmailPreferences = await db.query.emailPreferences.findFirst({
      where: eq(emailPreferences.userId, updatedUserData.address),
    });

    if (!existingEmailPreferences) {
      return response
        .status(404)
        .json({ error: "Email preferences not found" });
    }

    const updatedEmailPreferences = await db
      .update(emailPreferences)
      .set(updatedUserData.emailPreferences)
      .where(eq(emailPreferences.userId, updatedUserData.address));

    if (!updatedEmailPreferences) {
      return response
        .status(500)
        .json({ error: "Error updating email preferences" });
    }
  }

  return response.status(200).json({ data: updatedUser });
}

export async function deleteUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const userAddress = request.params.address;

    if (!userAddress || !isAddress(userAddress)) {
      return response.status(400).json({ error: "Invalid user address" });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, userAddress),
      with: {
        emailPreferences: true,
      },
    });

    if (!existingUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.address, userAddress));

    // Delete email preferences if they exist
    await db
      .delete(emailPreferences)
      .where(eq(emailPreferences.userId, existingUser.address));

    if (!deletedUser) {
      return response.status(500).json({ error: "Error deleting user" });
    }

    return response.status(200).json({ data: deletedUser });
  } catch (error) {
    next(error);
  }
}

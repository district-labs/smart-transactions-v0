import { eq } from "drizzle-orm";
import {
  DbInsertUserWithRelations,
  db,
  emailPreferences,
  users,
} from "../../..";

interface PutUserDbParams {
  updatedUserData: DbInsertUserWithRelations;
}

export async function putUserDb({ updatedUserData }: PutUserDbParams) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, updatedUserData.address),
  });

  if (!existingUser) {
    return { success: false, error: "User not found" } as const;
  }

  const updatedUser = await db
    .update(users)
    .set(updatedUserData)
    .where(eq(users.address, updatedUserData.address));

  if (!updatedUser) {
    return { success: false, error: "Error updating user" } as const;
  }

  // Update email preferences if they exist
  if (updatedUserData.emailPreferences) {
    const existingEmailPreferences = await db.query.emailPreferences.findFirst({
      where: eq(emailPreferences.userId, updatedUserData.address),
    });

    if (!existingEmailPreferences) {
      return { success: false, error: "Email preferences not found" } as const;
    }

    const updatedEmailPreferences = await db
      .update(emailPreferences)
      .set(updatedUserData.emailPreferences)
      .where(eq(emailPreferences.userId, updatedUserData.address));

    if (!updatedEmailPreferences) {
      return {
        success: false,
        error: "Error updating email preferences",
      } as const;
    }
  }

  return { success: true, data: updatedUser } as const;
}

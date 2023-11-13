import { eq } from "drizzle-orm";
import {
  DbInsertUserWithRelations,
  db,
  emailPreferences,
  users,
} from "../../..";

interface PostUserDbParams {
  newUserData: DbInsertUserWithRelations;
}

export async function postUserDb({ newUserData }: PostUserDbParams) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, newUserData.address),
  });

  if (existingUser) {
    return { success: false, error: "User already exists" } as const;
  }

  const newUser = await db.insert(users).values(newUserData);

  if (!newUser) {
    return { success: false, error: "Error creating user" } as const;
  }

  // Create email preferences if they exist
  if (newUserData.emailPreferences) {
    const newEmailPreferences = await db.insert(emailPreferences).values({
      ...newUserData.emailPreferences,
      userId: newUserData.address,
    });

    if (!newEmailPreferences) {
      return {
        success: false,
        error: "Error creating email preferences",
      } as const;
    }
  }

  return { success: true, data: newUser } as const;
}

import { eq } from "drizzle-orm";
import { db, emailPreferences, users } from "../../..";

interface DeleteUserDbParams {
  userAddress: string;
}
export async function deleteUserDb({ userAddress }: DeleteUserDbParams) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, userAddress),
    with: {
      emailPreferences: true,
    },
  });

  if (!existingUser) {
    return { success: false, error: "User not found" } as const;
  }

  const deletedUser = await db
    .delete(users)
    .where(eq(users.address, userAddress));

  // Delete email preferences if they exist
  await db
    .delete(emailPreferences)
    .where(eq(emailPreferences.userId, existingUser.address));

  if (!deletedUser) {
    return { success: false, error: "Error deleting user" } as const;
  }

  return { success: true, data: deletedUser } as const;
}

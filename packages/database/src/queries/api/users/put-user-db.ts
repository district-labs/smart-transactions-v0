import { eq } from "drizzle-orm";
import { db, DbNewUser, users } from "../../..";

export async function putUserDb(userData: DbNewUser) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, userData.address),
  });

  if (!existingUser) {
    return { ok: false, error: "User not found" } as const;
  }

  const updatedUser = await db
    .update(users)
    .set(userData)
    .where(eq(users.address, userData.address));

  if (!updatedUser) {
    return { ok: false, error: "Error updating user" } as const;
  }

  return { ok: true } as const;
}

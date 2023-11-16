import { eq } from "drizzle-orm";
import {
  DbNewEmailPreferences,
  DbNewUser,
  db,
  emailPreferences,
  users,
} from "../../..";

interface PostUserDbParams {
  newUserData: DbNewUser;
  emailPreferencesData: DbNewEmailPreferences;
}

export async function postUserDb({
  newUserData,
  emailPreferencesData,
}: PostUserDbParams) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.address, newUserData.address),
  });

  if (existingUser) {
    return { ok: false, error: "User already exists" } as const;
  }

  await db.transaction(async (tx) => {
    await db.insert(users).values(newUserData);
    await db.insert(emailPreferences).values(emailPreferencesData);
  });

  return { ok: true } as const;
}

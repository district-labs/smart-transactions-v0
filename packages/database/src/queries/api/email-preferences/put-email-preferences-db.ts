import { eq } from "drizzle-orm";
import { db, DbNewEmailPreferences, emailPreferences } from "../../..";

export async function putEmailPreferencesDb(
  emailPreferencesData: DbNewEmailPreferences,
) {
  const existingEmailPreferences = await db.query.emailPreferences.findFirst({
    where: eq(emailPreferences.userId, emailPreferencesData.userId),
  });

  if (!existingEmailPreferences) {
    return { ok: false, error: "Email preferences not found" } as const;
  }

  const updatedEmailPreferences = await db
    .update(emailPreferences)
    .set(emailPreferencesData)
    .where(eq(emailPreferences.id, existingEmailPreferences.id));

  if (!updatedEmailPreferences) {
    return { ok: false, error: "Error updating email preferences" } as const;
  }
  return { ok: true } as const;
}

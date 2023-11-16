import { eq } from "drizzle-orm";
import { db, users } from "../../..";

interface GetUserDbParams {
  userAddress: string;
  expandFields: string[];
}

export async function getUserDb({
  userAddress,
  expandFields,
}: GetUserDbParams) {
  const user = await db.query.users.findFirst({
    where: eq(users.address, userAddress),
    with: {
      strategies: expandFields.includes("strategies") ? true : undefined,
      emailPreferences: expandFields.includes("emailPreferences")
        ? true
        : undefined,
    },
  });

  return user;
}

import { db } from "../../..";

interface GetUsersDbParams {
  limit: string | undefined;
  offset: string | undefined;
  expandFields: string[];
}

export async function getUsersDb({
  limit,
  offset,
  expandFields,
}: GetUsersDbParams) {
  const users = await db.query.users.findMany({
    limit: Number(limit),
    offset: Number(offset),
    with: {
      strategies: expandFields.includes("strategies") ? true : undefined,
      emailPreferences: expandFields.includes("emailPreferences")
        ? true
        : undefined,
    },
  });

  return users;
}

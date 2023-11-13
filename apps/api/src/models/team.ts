import type { DbTeam, DbUserToTeam } from "@district-labs/intentify-database";
import {
  and,
  db,
  eq,
  teams,
  teamsToStrategies,
  usersToTeams,
} from "@district-labs/intentify-database";

/**
 * Fetches Teams from the database based on the provided filters.
 * @param filters - Optional filters to apply to the query.
 * @returns - Array of Team matching the filters.
 */
export const getTeamsFromDB = async (filters: any): Promise<DbTeam[]> => {
  return db.query.teams.findMany({
    with: {
      members: {
        with: {
          user: true,
        },
      },
      strategies: {
        with: {
          strategy: true,
        },
      },
    },
  });
};

/**
 * Fetches a Team by ID.
 * @param userId - The ID of the Team to fetch.
 * @returns - Team matching the provided ID.
 */
export const getTeamFromDB = async (
  teamId: number,
): Promise<DbTeam | undefined> => {
  return db.query.teams.findFirst({
    where: eq(teams.id, teamId),
    with: {
      members: {
        with: {
          user: true,
        },
      },
      strategies: {
        with: {
          strategy: true,
        },
      },
    },
  });
};

/**
 * Inserts a new Team into the database.
 * @returns - Response
 */
export const createTeamInDB = async ({
  name,
  description,
  createdBy,
}: {
  name: string;
  description: string;
  createdBy: string;
}): Promise<Response> => {
  await db.transaction(async (tx: any) => {
    const teamTable = await tx.insert(teams).values({
      name,
      description,
      createdBy,
    });

    await tx.insert(usersToTeams).values({
      role: "owner",
      userId: createdBy,
      teamId: teamTable.insertId,
    });
  });

  return new Response(JSON.stringify({ ok: true }));
};

/**
 * Inserts a new Team into the database.
 * @returns - Response
 */
export const createInviteToTeamInDB = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}): Promise<Response> => {
  const teamsToStrategiesTable = await db.insert(usersToTeams).values({
    role: "invited",
    teamId,
    userId,
  });
  const res = new Response(
    JSON.stringify({ id: teamsToStrategiesTable.insertId, winning: true }),
  );
  res.headers.set("Content-Type", "application/json");
  return res;
};

/**
 * Inserts a new Team into the database.
 * @returns - Response
 */
export const addStrategyToTeamInDB = async ({
  teamId,
  strategyId,
  createdBy,
}: {
  teamId: number;
  strategyId: string;
  createdBy: string;
}): Promise<Response> => {
  const teamsToStrategiesTable = await db.insert(teamsToStrategies).values({
    createdBy,
    teamId,
    strategyId,
  });
  return new Response(JSON.stringify({ id: teamsToStrategiesTable.insertId }));
};

/**
 * Fetches a Team invitation by ID.
 * @param userId - The ID of the user to fetch.
 * @param teamId - The ID of the Team to fetch.
 * @returns - Team matching the provided ID.
 */
export const getTeamInvitationFromDB = async ({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}): Promise<DbUserToTeam | undefined> => {
  return db.query.usersToTeams.findFirst({
    where: and(
      eq(usersToTeams.role, "invited"),
      eq(usersToTeams.userId, userId),
      eq(usersToTeams.teamId, teamId),
    ),
    with: {
      team: true,
    },
  });
};

/**
 * Fetches a Team invitation by ID.
 * @param userId - The ID of the User to fetch.
 * @param teamId - The ID of the Team to fetch.
 * @returns - Team matching the provided ID.
 */
export const acceptTeamInvitationFromDB = async ({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}): Promise<Response> => {
  await db.update(usersToTeams).set({
    role: "member",
  }).where(
    and(
      eq(usersToTeams.userId, userId),
      eq(usersToTeams.teamId, teamId),
    ),
  );
  return new Response(JSON.stringify({ ok: true }));
};
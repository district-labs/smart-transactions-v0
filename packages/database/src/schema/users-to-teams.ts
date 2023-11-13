import { relations } from "drizzle-orm"
import { int, mysqlEnum, mysqlTable, primaryKey } from "drizzle-orm/mysql-core"

import { teams, users } from "."
import { charAddress } from "../utils/schema";

export const usersToTeams = mysqlTable("users_to_teams", {
    role: mysqlEnum('role', ['invited', 'member', 'admin', 'owner']).notNull(),
    userId: charAddress('user_id').notNull(),
    teamId: int('team_id').notNull()
    }, (t) => ({
        pk: primaryKey(t.userId, t.teamId),
    })
);

export const usersToTeamsRelations = relations(usersToTeams, ({ one, }) => ({
    user: one(users, {
        fields: [usersToTeams.userId],
        references: [users.address],
    }),
    team: one(teams, {
		fields: [usersToTeams.teamId],
		references: [teams.id],
	}),
}))

export type DbUserToTeam = typeof usersToTeams.$inferSelect
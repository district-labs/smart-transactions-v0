import { relations } from "drizzle-orm"
import { char, int, mysqlTable, primaryKey } from "drizzle-orm/mysql-core"

import { strategies, teams, users } from "."
import { charAddress, charHash } from "../utils/schema";

export const teamsToStrategies = mysqlTable("teams_to_strategies", {
	createdBy: charAddress('created_by').notNull(),
    teamId: int('team_id').notNull(),
    strategyId: charHash('strategy_id').notNull(),
    }, (t) => ({
        pk: primaryKey(t.strategyId, t.teamId),
    })
);

export const teamsToStrategiesRelations = relations(teamsToStrategies, ({ one, }) => ({
    creator: one(users, {
		fields: [teamsToStrategies.createdBy],
		references: [users.address],
	}),
    team: one(teams, {
		fields: [teamsToStrategies.teamId],
		references: [teams.id],
	}),
	strategy: one(strategies, {
		fields: [teamsToStrategies.strategyId],
		references: [strategies.id],
	}),
}))

export type DbTeamsToStrategies = typeof teamsToStrategies.$inferSelect
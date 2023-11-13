import { relations } from "drizzle-orm"
import { mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"

import { teamsToStrategies, usersToTeams } from "."

export const teams = mysqlTable("teams", {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
})

export type DbTeam = typeof teams.$inferSelect

export const teamRelations = relations(teams, ({ one, many }) => ({
  members: many(usersToTeams),
  strategies: many(teamsToStrategies),
}))

ALTER TABLE `teams_to_strategies` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `teams_to_strategies` MODIFY COLUMN `team_id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `teams_to_strategies` DROP COLUMN `id`;
ALTER TABLE `intent_batch_execution` ADD `chain_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD `cancelled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `investments` DROP COLUMN `amount`;--> statement-breakpoint
ALTER TABLE `strategies` DROP COLUMN `assets`;--> statement-breakpoint
ALTER TABLE `strategies` DROP COLUMN `coins`;--> statement-breakpoint
ALTER TABLE `strategies` DROP COLUMN `performance_fee`;--> statement-breakpoint
ALTER TABLE `strategies` DROP COLUMN `platform_fee`;
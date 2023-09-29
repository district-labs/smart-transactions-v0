ALTER TABLE `intent_batch` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `user_id` char(42) NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch` MODIFY COLUMN `intent_batch_hash` char(42) NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` MODIFY COLUMN `intent_batch_id` char(42) NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `user_id` char(42) NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD `executor` char(42) NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD PRIMARY KEY(`intent_batch_hash`);
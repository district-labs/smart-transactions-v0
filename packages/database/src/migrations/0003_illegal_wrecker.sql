ALTER TABLE `intent_batch` MODIFY COLUMN `strategy_id` char(66) NOT NULL;--> statement-breakpoint
ALTER TABLE `strategies` MODIFY COLUMN `id` char(66) NOT NULL;--> statement-breakpoint
ALTER TABLE `email_preferences` ADD `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `strategies` ADD `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `strategies` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `about`;
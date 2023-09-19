CREATE TABLE `hooks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`target` char(42) NOT NULL,
	`data` text,
	CONSTRAINT `hooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intent_batch` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nonce` char(66) NOT NULL,
	`intent_batch_execution_id` int NOT NULL,
	CONSTRAINT `intent_batch_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intent_batch_execution` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`signature` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `intent_batch_execution_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intents` (
	`id` char(66),
	`name` varchar(255) NOT NULL,
	`version` char(5) NOT NULL,
	`intent_args` json NOT NULL,
	`root` char(42) NOT NULL,
	`target` char(42) NOT NULL,
	`data` text,
	`intent_batch_id` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `investments` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `investments` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `investments` RENAME COLUMN `strategyId` TO `strategy_id`;--> statement-breakpoint
ALTER TABLE `strategies` RENAME COLUMN `performanceFee` TO `performance_fee`;--> statement-breakpoint
ALTER TABLE `strategies` RENAME COLUMN `platformFee` TO `platform_fee`;--> statement-breakpoint
ALTER TABLE `strategies` RENAME COLUMN `managerId` TO `manager_id`;--> statement-breakpoint
ALTER TABLE `strategies` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `firstName` TO `first_name`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `lastName` TO `last_name`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `newsletter` boolean;--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `marketing` boolean;--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `transactional` boolean;--> statement-breakpoint
ALTER TABLE `strategies` MODIFY COLUMN `manager_id` char(42) NOT NULL;--> statement-breakpoint
ALTER TABLE `strategies` ADD `intent_batch_execution_id` int;--> statement-breakpoint
ALTER TABLE `users` ADD `safe_address` char(42);--> statement-breakpoint
ALTER TABLE `email_preferences` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `users` ADD PRIMARY KEY(`address`);
ALTER TABLE `strategies` RENAME COLUMN `userId` TO `managerId`;--> statement-breakpoint
ALTER TABLE `investments` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `investments` ADD `strategyId` int NOT NULL;
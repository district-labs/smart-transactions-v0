ALTER TABLE `users` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `firstName` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `lastName` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `email` varchar(255);
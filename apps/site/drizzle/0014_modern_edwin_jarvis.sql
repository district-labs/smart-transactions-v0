ALTER TABLE `intents` MODIFY COLUMN `id` char(66) NOT NULL;--> statement-breakpoint
ALTER TABLE `intents` ADD PRIMARY KEY(`id`);
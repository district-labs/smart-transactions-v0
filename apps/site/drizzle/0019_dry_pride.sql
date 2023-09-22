ALTER TABLE `intent_batch` ADD `root` char(42) NOT NULL;--> statement-breakpoint
ALTER TABLE `intents` ADD `value` int DEFAULT 0;
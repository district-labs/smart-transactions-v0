ALTER TABLE `intent_batch_execution` ADD `executed` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD `executed_at` timestamp;
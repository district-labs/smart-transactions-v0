ALTER TABLE `intent_batch_execution` RENAME COLUMN `executedTxHash` TO `executed_tx_hash`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` DROP CONSTRAINT `intent_batch_execution_executedTxHash_unique`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `executed_at` timestamp;--> statement-breakpoint
ALTER TABLE `intents` ADD `intent_id` char(66) NOT NULL;--> statement-breakpoint
ALTER TABLE `intents` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `intents` DROP COLUMN `version`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD CONSTRAINT `intent_batch_execution_executed_tx_hash_unique` UNIQUE(`executed_tx_hash`);
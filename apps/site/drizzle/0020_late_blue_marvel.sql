DROP TABLE `investments`;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `chain_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `signature` text NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `cancelled_tx_hash` char(66);--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `strategy_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD `updated_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD `executedTxHash` char(66);--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD `intent_batch_id` int;--> statement-breakpoint
ALTER TABLE `email_preferences` DROP COLUMN `token`;--> statement-breakpoint
ALTER TABLE `intent_batch` DROP COLUMN `intent_batch_execution_id`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` DROP COLUMN `chain_id`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` DROP COLUMN `signature`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` DROP COLUMN `executed`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` DROP COLUMN `cancelled`;--> statement-breakpoint
ALTER TABLE `strategies` DROP COLUMN `intent_batch_execution_id`;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD CONSTRAINT `intent_batch_cancelled_tx_hash_unique` UNIQUE(`cancelled_tx_hash`);--> statement-breakpoint
ALTER TABLE `intent_batch_execution` ADD CONSTRAINT `intent_batch_execution_executedTxHash_unique` UNIQUE(`executedTxHash`);
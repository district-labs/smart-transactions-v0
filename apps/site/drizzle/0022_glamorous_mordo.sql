ALTER TABLE `intent_batch` ADD `executed_tx_hash` char(66);--> statement-breakpoint
ALTER TABLE `intent_batch` ADD `cancelled_at` timestamp;--> statement-breakpoint
ALTER TABLE `intent_batch` ADD CONSTRAINT `intent_batch_executed_tx_hash_unique` UNIQUE(`executed_tx_hash`);
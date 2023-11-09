ALTER TABLE `intent_batch` DROP CONSTRAINT `intent_batch_executed_tx_hash_unique`;--> statement-breakpoint
ALTER TABLE `intent_batch` DROP COLUMN `executed_tx_hash`;
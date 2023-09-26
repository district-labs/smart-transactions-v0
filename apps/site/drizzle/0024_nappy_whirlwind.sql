ALTER TABLE `intent_batch_execution` DROP CONSTRAINT `intent_batch_execution_executed_tx_hash_unique`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` DROP COLUMN `executed_tx_hash`;--> statement-breakpoint
ALTER TABLE `intent_batch_execution` DROP COLUMN `executed_at`;
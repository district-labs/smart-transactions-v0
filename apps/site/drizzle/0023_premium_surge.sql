ALTER TABLE `intent_batch` ADD `intent_batch_hash` char(66);--> statement-breakpoint
ALTER TABLE `intent_batch` ADD CONSTRAINT `intent_batch_intent_batch_hash_unique` UNIQUE(`intent_batch_hash`);
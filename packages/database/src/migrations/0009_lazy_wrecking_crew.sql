CREATE TABLE `transactions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`intent_batch_id` char(66),
	`chain_id` int NOT NULL,
	`transaction_hash` char(66),
	`block_hash` char(66),
	`block_number` int,
	`to` char(42),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);

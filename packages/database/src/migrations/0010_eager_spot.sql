CREATE TABLE `axiom_query` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`keccak_query_response` char(66) NOT NULL,
	`block_number` int NOT NULL,
	`address` char(42) NOT NULL,
	`slot` int NOT NULL,
	CONSTRAINT `axiom_query_id` PRIMARY KEY(`id`)
);

CREATE TABLE `teams` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(255),
	`last_name` text,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_to_teams` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`role` enum('invited','member','admin','owner'),
	`user_id` char(42) NOT NULL,
	`team_id` char NOT NULL,
	CONSTRAINT `users_to_teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams_to_strategies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`team_id` char NOT NULL,
	`strategy_id` char(66) NOT NULL,
	CONSTRAINT `teams_to_strategies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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

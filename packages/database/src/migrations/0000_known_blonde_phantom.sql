CREATE TABLE `email_preferences` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`newsletter` boolean,
	`marketing` boolean,
	`transactional` boolean,
	`created_at` timestamp DEFAULT (now()),
	`user_id` char(42) NOT NULL,
	CONSTRAINT `email_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hooks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`target` char(42) NOT NULL,
	`data` text,
	`intent_batch_execution_id` int NOT NULL,
	CONSTRAINT `hooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intent_batch` (
	`intent_batch_hash` char(66) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`root` char(42) NOT NULL,
	`nonce` char(66) NOT NULL,
	`chain_id` int NOT NULL,
	`signature` text NOT NULL,
	`executed_tx_hash` char(66),
	`executed_at` timestamp,
	`cancelled_tx_hash` char(66),
	`cancelled_at` timestamp,
	`strategy_id` int NOT NULL,
	`user_id` char(42) NOT NULL,
	CONSTRAINT `intent_batch_intent_batch_hash` PRIMARY KEY(`intent_batch_hash`),
	CONSTRAINT `intent_batch_executed_tx_hash_unique` UNIQUE(`executed_tx_hash`),
	CONSTRAINT `intent_batch_cancelled_tx_hash_unique` UNIQUE(`cancelled_tx_hash`)
);
--> statement-breakpoint
CREATE TABLE `intent_batch_execution` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`executor` char(42) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`intent_batch_id` char(42) NOT NULL,
	CONSTRAINT `intent_batch_execution_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`intent_id` char(66) NOT NULL,
	`intent_batch_id` char(66) NOT NULL,
	`intent_args` json NOT NULL,
	`root` char(42) NOT NULL,
	`target` char(42) NOT NULL,
	`data` text,
	`value` int DEFAULT 0,
	CONSTRAINT `intents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('strategy','portfolio') NOT NULL DEFAULT 'strategy',
	`created_at` timestamp DEFAULT (now()),
	`manager_id` char(42) NOT NULL,
	CONSTRAINT `strategies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`address` char(42) NOT NULL,
	`first_name` varchar(255),
	`last_name` varchar(255),
	`email` varchar(255),
	`safe_address` char(42),
	`about` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_address` PRIMARY KEY(`address`)
);

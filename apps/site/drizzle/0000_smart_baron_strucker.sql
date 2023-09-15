CREATE TABLE `email_preferences` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(256),
	`email` varchar(256) NOT NULL,
	`token` varchar(256) NOT NULL,
	`newsletter` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`transactional` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `email_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`category` enum('strategy','portfolio') NOT NULL DEFAULT 'strategy',
	`assets` decimal(12,2) NOT NULL DEFAULT '0',
	`performanceFee` decimal(5,2) NOT NULL DEFAULT '10.00',
	`platformFee` decimal(5,2) NOT NULL DEFAULT '0.25',
	`userId` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `strategies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`about` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);

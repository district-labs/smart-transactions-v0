CREATE TABLE `email_preferences` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(255),
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`newsletter` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`transactional` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `email_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`strategyId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('strategy','portfolio') NOT NULL DEFAULT 'strategy',
	`assets` decimal(12,2) NOT NULL DEFAULT '0',
	`coins` json,
	`performanceFee` decimal(5,2) NOT NULL DEFAULT '10.00',
	`platformFee` decimal(5,2) NOT NULL DEFAULT '0.25',
	`managerId` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `strategies_id` PRIMARY KEY(`id`)
);

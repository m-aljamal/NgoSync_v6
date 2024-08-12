CREATE TABLE `ngosync_fund_transactions` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ngosync_funds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ngosync_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_tr` text,
	`description` text,
	`status` text DEFAULT 'in-progress' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`system` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ngosync_projects_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ngosync_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`title` text,
	`status` text(30) DEFAULT 'todo' NOT NULL,
	`label` text(30) DEFAULT 'bug' NOT NULL,
	`priority` text(30) DEFAULT 'low' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ngosync_funds_name_unique` ON `ngosync_funds` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `ngosync_projects_name_unique` ON `ngosync_projects` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `ngosync_tasks_code_unique` ON `ngosync_tasks` (`code`);
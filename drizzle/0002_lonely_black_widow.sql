CREATE TABLE `ngosync_donations` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL,
	`payment_type` text NOT NULL,
	`is_offical` integer DEFAULT false NOT NULL,
	`receipt_description` text,
	`amount_in_text` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ngosync_doners` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`gender` text NOT NULL,
	`email` text,
	`phone` text,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`description` text,
	`address` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

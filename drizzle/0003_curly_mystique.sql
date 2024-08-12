ALTER TABLE `ngosync_projects_transactions` ADD `amount_in_usd` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `official_amount` integer;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `proposal_amount` integer;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `description` text;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `is_offical` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `date` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `ngosync_projects_transactions` ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;
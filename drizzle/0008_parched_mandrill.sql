CREATE TABLE IF NOT EXISTS "ngosync_proposals_expenses" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"proposal_id" varchar(30) NOT NULL,
	"amount" integer NOT NULL,
	"currency_id" varchar(30) NOT NULL,
	"description" varchar(200),
	"expenses_category_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
ALTER TABLE "ngosync_donations" ADD COLUMN "project_id" varchar(30);--> statement-breakpoint
ALTER TABLE "ngosync_donations" ADD COLUMN "proposal_id" varchar(30);--> statement-breakpoint
ALTER TABLE "ngosync_expenses_categories" ADD COLUMN "project_id" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_projects_transactions" ADD COLUMN "proposal_id" varchar;
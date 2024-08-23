ALTER TABLE "ngosync_projects_transactions" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_projects_transactions" ADD CONSTRAINT "ngosync_projects_transactions_project_id_ngosync_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ngosync_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_projects_transactions" ADD CONSTRAINT "ngosync_projects_transactions_currency_id_ngosync_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."ngosync_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_projects_transactions" ADD CONSTRAINT "ngosync_projects_transactions_expenses_category_id_ngosync_expenses_categories_id_fk" FOREIGN KEY ("expenses_category_id") REFERENCES "public"."ngosync_expenses_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_projects_transactions" ADD CONSTRAINT "ngosync_projects_transactions_proposal_id_ngosync_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."ngosync_proposals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

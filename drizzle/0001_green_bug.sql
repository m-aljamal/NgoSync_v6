ALTER TABLE "ngosync_donations" ADD COLUMN "fund_transaction_id" varchar(30);--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "fund_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "currency_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "amount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "amount_in_usd" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "proposal_amount" integer;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "official_amount" integer;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "transaction_type" "transaction_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "description" varchar(200);--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "transaction_category" "transaction_category" NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "is_offical" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_donations" ADD CONSTRAINT "ngosync_donations_doner_id_ngosync_doners_id_fk" FOREIGN KEY ("doner_id") REFERENCES "public"."ngosync_doners"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_donations" ADD CONSTRAINT "ngosync_donations_project_id_ngosync_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ngosync_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_donations" ADD CONSTRAINT "ngosync_donations_proposal_id_ngosync_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."ngosync_proposals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_donations" ADD CONSTRAINT "ngosync_donations_fund_transaction_id_ngosync_fund_transactions_id_fk" FOREIGN KEY ("fund_transaction_id") REFERENCES "public"."ngosync_fund_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_fund_transactions" ADD CONSTRAINT "ngosync_fund_transactions_fund_id_ngosync_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."ngosync_funds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_fund_transactions" ADD CONSTRAINT "ngosync_fund_transactions_currency_id_ngosync_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."ngosync_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

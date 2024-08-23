ALTER TABLE "ngosync_donations" DROP CONSTRAINT "ngosync_donations_fund_transaction_id_ngosync_fund_transactions_id_fk";
--> statement-breakpoint
ALTER TABLE "ngosync_donations" ALTER COLUMN "fund_transaction_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_donations" ADD CONSTRAINT "ngosync_donations_fund_transaction_id_ngosync_fund_transactions_id_fk" FOREIGN KEY ("fund_transaction_id") REFERENCES "public"."ngosync_fund_transactions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

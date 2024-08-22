DO $$ BEGIN
 CREATE TYPE "public"."transaction_category_enum" AS ENUM('donation', 'fund_transaction', 'transfer_between_funds', 'transfer_to_project', 'transfer_from_project', 'currency_exchange');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ADD COLUMN "transaction_category_enum" "transaction_category_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" DROP COLUMN IF EXISTS "transaction_category";
ALTER TABLE "ngosync_donations" ALTER COLUMN "amount" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ALTER COLUMN "amount" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ALTER COLUMN "amount_in_usd" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ALTER COLUMN "proposal_amount" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "ngosync_fund_transactions" ALTER COLUMN "official_amount" SET DATA TYPE numeric;
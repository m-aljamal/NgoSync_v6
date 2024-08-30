CREATE TABLE IF NOT EXISTS "ngosync_exchnage_between_funds" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"sender" varchar NOT NULL,
	"receiver" varchar NOT NULL,
	"rate" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_exchnage_between_funds" ADD CONSTRAINT "ngosync_exchnage_between_funds_sender_ngosync_fund_transactions_id_fk" FOREIGN KEY ("sender") REFERENCES "public"."ngosync_fund_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_exchnage_between_funds" ADD CONSTRAINT "ngosync_exchnage_between_funds_receiver_ngosync_fund_transactions_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."ngosync_fund_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

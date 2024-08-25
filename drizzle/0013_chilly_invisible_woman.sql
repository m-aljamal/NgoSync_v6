CREATE TABLE IF NOT EXISTS "ngosync_currency_rates" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"rate" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"from_currency_id" integer NOT NULL,
	"to_currency_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_currency_rates" ADD CONSTRAINT "ngosync_currency_rates_from_currency_id_ngosync_currencies_id_fk" FOREIGN KEY ("from_currency_id") REFERENCES "public"."ngosync_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_currency_rates" ADD CONSTRAINT "ngosync_currency_rates_to_currency_id_ngosync_currencies_id_fk" FOREIGN KEY ("to_currency_id") REFERENCES "public"."ngosync_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "ngosync_currencies" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"code" varchar(50) NOT NULL,
	"locale" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"official" boolean DEFAULT false,
	CONSTRAINT "ngosync_currencies_name_unique" UNIQUE("name"),
	CONSTRAINT "ngosync_currencies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_proposals" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"project_id" varchar(30) NOT NULL,
	"amount" integer NOT NULL,
	"currency_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "ngosync_proposals_name_unique" UNIQUE("name")
);

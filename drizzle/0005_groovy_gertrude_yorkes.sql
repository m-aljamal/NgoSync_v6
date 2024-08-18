DO $$ BEGIN
 CREATE TYPE "public"."donation_payment_types" AS ENUM('cash', 'debt');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."doner_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."doner_types" AS ENUM('individual', 'orgnization');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."genders" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_category" AS ENUM('transfer_between_projects', 'expense', 'transfer_from_fund', 'transfer_to_fund', 'currency_exchange', 'loan');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('income', 'outcome');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_donations" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"doner_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"donation_payment_types" "donation_payment_types" NOT NULL,
	"is_offical" boolean DEFAULT false NOT NULL,
	"receipt_description" varchar(300),
	"amount_in_text" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_doners" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"genders" "genders" NOT NULL,
	"email" varchar(120),
	"phone" varchar(20),
	"doner_types" "doner_types" NOT NULL,
	"doner_status" "doner_status" NOT NULL,
	"description" varchar(200),
	"address" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "ngosync_doners_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_expenses_categories" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_fund_transactions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_funds" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(128),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "ngosync_funds_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_projects_transactions" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"project_id" varchar NOT NULL,
	"currency_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"amount_in_usd" integer NOT NULL,
	"official_amount" integer,
	"proposal_amount" integer,
	"transaction_type" "transaction_type" NOT NULL,
	"transaction_category" "transaction_category" NOT NULL,
	"transaction_status" "transaction_status" NOT NULL,
	"description" varchar(200),
	"is_offical" boolean DEFAULT false NOT NULL,
	"expenses_category_id" varchar,
	"date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
ALTER TABLE "ngosync_projects" ADD CONSTRAINT "ngosync_projects_name_unique" UNIQUE("name");
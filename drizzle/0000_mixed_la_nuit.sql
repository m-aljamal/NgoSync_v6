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
 CREATE TYPE "public"."status_enum" AS ENUM('in-progress', 'done', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."systems_enum" AS ENUM('school', 'cultural_center', 'relief', 'office', 'health');
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
DO $$ BEGIN
 CREATE TYPE "public"."role_enum" AS ENUM('admin', 'project_manager', 'viewer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "ngosync_donations" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"doner_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"donation_payment_types" "donation_payment_types" NOT NULL,
	"is_offical" boolean DEFAULT false NOT NULL,
	"receipt_description" varchar(300),
	"amount_in_text" varchar(200),
	"project_id" varchar(30),
	"proposal_id" varchar(30),
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
CREATE TABLE IF NOT EXISTS "ngosync_funds" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "ngosync_funds_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_projects" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"nameTr" varchar(128),
	"description" varchar(200),
	"status_enum" "status_enum" DEFAULT 'in-progress' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"systems_enum" "systems_enum" NOT NULL,
	"user_id" varchar NOT NULL,
	CONSTRAINT "ngosync_projects_name_unique" UNIQUE("name")
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
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "ngosync_tasks" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"code" varchar(128) NOT NULL,
	"title" varchar(128),
	"status" varchar(30) DEFAULT 'todo' NOT NULL,
	"label" varchar(30) DEFAULT 'bug' NOT NULL,
	"priority" varchar(30) DEFAULT 'low' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "ngosync_tasks_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_expenses_categories" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"project_id" varchar(30) NOT NULL,
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
	"proposal_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "ngosync_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "ngosync_authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "ngosync_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"role_enum" "role_enum" DEFAULT 'viewer' NOT NULL,
	CONSTRAINT "ngosync_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ngosync_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_projects" ADD CONSTRAINT "ngosync_projects_user_id_ngosync_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ngosync_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_account" ADD CONSTRAINT "ngosync_account_userId_ngosync_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ngosync_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_authenticator" ADD CONSTRAINT "ngosync_authenticator_userId_ngosync_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ngosync_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_session" ADD CONSTRAINT "ngosync_session_userId_ngosync_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ngosync_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

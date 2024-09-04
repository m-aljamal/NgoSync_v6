DO $$ BEGIN
 CREATE TYPE "public"."positions" AS ENUM('manager', 'employee', 'teacher', 'volunteer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_employees" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"project_id" varchar(30) NOT NULL,
	"genders" "genders" NOT NULL,
	"email" varchar(120),
	"phone" varchar(20),
	"employee_status" "doner_status" NOT NULL,
	"description" varchar(200),
	"salary" integer,
	"currency_id" varchar,
	"address" varchar(200),
	"birth_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"positions" "positions" NOT NULL,
	"job_title_id" varchar(30) NOT NULL,
	CONSTRAINT "ngosync_employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_employees_job_titles" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_employees" ADD CONSTRAINT "ngosync_employees_project_id_ngosync_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ngosync_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_employees" ADD CONSTRAINT "ngosync_employees_currency_id_ngosync_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."ngosync_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_employees" ADD CONSTRAINT "ngosync_employees_job_title_id_ngosync_employees_job_titles_id_fk" FOREIGN KEY ("job_title_id") REFERENCES "public"."ngosync_employees_job_titles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

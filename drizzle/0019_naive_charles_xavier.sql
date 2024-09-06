DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('loan', 'repayment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ngosync_loans" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"project_transaction_id" varchar NOT NULL,
	"employee_id" varchar NOT NULL,
	"type" "type" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_loans" ADD CONSTRAINT "ngosync_loans_project_transaction_id_ngosync_projects_transactions_id_fk" FOREIGN KEY ("project_transaction_id") REFERENCES "public"."ngosync_projects_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ngosync_loans" ADD CONSTRAINT "ngosync_loans_employee_id_ngosync_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."ngosync_employees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ngosync_employees_job_titles" ADD CONSTRAINT "ngosync_employees_job_titles_name_unique" UNIQUE("name");
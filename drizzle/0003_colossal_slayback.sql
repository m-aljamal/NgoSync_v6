DO $$ BEGIN
 CREATE TYPE "public"."role_enum" AS ENUM('admin', 'project_manager', 'viewer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ngosync_user" ADD COLUMN "role_enum" "role_enum" DEFAULT 'viewer' NOT NULL;
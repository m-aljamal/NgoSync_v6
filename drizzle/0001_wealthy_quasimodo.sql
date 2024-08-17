ALTER TABLE "ngosync_projects" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "ngosync_projects" ALTER COLUMN "name" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "ngosync_projects" ADD COLUMN "description" varchar(200);
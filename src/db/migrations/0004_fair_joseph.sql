ALTER TABLE "chapters" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "content" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "chapter_groups" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;
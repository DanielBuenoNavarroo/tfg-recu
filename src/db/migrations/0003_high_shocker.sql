CREATE TABLE "chapter_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "visits" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "last_updated" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "chapter_groups" ADD CONSTRAINT "chapter_groups_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_group_id_chapter_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."chapter_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" DROP COLUMN "number";
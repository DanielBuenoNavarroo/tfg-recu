CREATE TABLE "authors_balance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"balance" numeric(10, 2) DEFAULT 0 NOT NULL,
	"currency" varchar(3) DEFAULT 'EUR',
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "authors_balance" ADD CONSTRAINT "authors_balance_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
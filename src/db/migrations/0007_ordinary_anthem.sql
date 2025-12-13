CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'EUR',
	"purchased_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "price" numeric(10, 2) DEFAULT 0;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "currency" varchar(3) DEFAULT 'EUR';--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
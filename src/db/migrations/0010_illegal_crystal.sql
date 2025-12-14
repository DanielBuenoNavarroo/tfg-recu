ALTER TABLE "authors_balance" ALTER COLUMN "balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "authors_balance" ALTER COLUMN "currency" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "authors_balance_author_currency_idx" ON "authors_balance" USING btree ("author_id","currency");
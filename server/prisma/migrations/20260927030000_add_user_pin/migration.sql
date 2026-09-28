-- AlterTable: PIN de descubrimiento (único por usuario). El default volátil
-- rellena las filas existentes con valores distintos antes de crear el índice único.
ALTER TABLE "anomchat_users" ADD COLUMN     "pin" VARCHAR(16) NOT NULL DEFAULT (upper(substr(md5((random())::text), 1, 8)));

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_users_pin_key" ON "anomchat_users"("pin");

-- CreateIndex
CREATE INDEX "anomchat_users_pin_idx" ON "anomchat_users"("pin");

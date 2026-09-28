-- AlterTable
ALTER TABLE "anomchat_users" ALTER COLUMN "pin" SET DEFAULT (upper(substr(md5((random())::text), 1, 8)));

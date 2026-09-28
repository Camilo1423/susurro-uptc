-- CreateEnum
CREATE TYPE "AvatarType" AS ENUM ('THUMBNAIL', 'ORIGINAL');

-- CreateTable
CREATE TABLE "anomchat_user_avatars" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "AvatarType" NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomchat_user_avatars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_user_avatars_id_key" ON "anomchat_user_avatars"("id");

-- CreateIndex
CREATE INDEX "anomchat_user_avatars_user_id_idx" ON "anomchat_user_avatars"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_user_avatars_user_id_type_key" ON "anomchat_user_avatars"("user_id", "type");

-- AddForeignKey
ALTER TABLE "anomchat_user_avatars" ADD CONSTRAINT "anomchat_user_avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "anomchat_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

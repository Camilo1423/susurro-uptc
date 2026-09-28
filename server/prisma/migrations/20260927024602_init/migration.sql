-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING', 'DELETED');

-- CreateTable
CREATE TABLE "anomchat_document_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomchat_document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomchat_users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "second_name" VARCHAR(100),
    "first_last_name" VARCHAR(100) NOT NULL,
    "second_last_name" VARCHAR(100),
    "document_type_id" UUID NOT NULL,
    "document_number" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(20),
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "require_change_password" BOOLEAN NOT NULL DEFAULT false,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "blocked_at" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomchat_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomchat_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "jti" UUID NOT NULL,
    "session_key" UUID NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomchat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomchat_refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "session_key" UUID NOT NULL,
    "jti" UUID NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomchat_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomchat_blacklist_access_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "jti" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anomchat_blacklist_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_document_types_id_key" ON "anomchat_document_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_document_types_name_key" ON "anomchat_document_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_document_types_code_key" ON "anomchat_document_types"("code");

-- CreateIndex
CREATE INDEX "anomchat_document_types_name_idx" ON "anomchat_document_types"("name");

-- CreateIndex
CREATE INDEX "anomchat_document_types_code_idx" ON "anomchat_document_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_users_id_key" ON "anomchat_users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_users_email_key" ON "anomchat_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_users_username_key" ON "anomchat_users"("username");

-- CreateIndex
CREATE INDEX "anomchat_users_email_idx" ON "anomchat_users"("email");

-- CreateIndex
CREATE INDEX "anomchat_users_username_idx" ON "anomchat_users"("username");

-- CreateIndex
CREATE INDEX "anomchat_users_status_idx" ON "anomchat_users"("status");

-- CreateIndex
CREATE INDEX "anomchat_users_document_type_id_idx" ON "anomchat_users"("document_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_sessions_id_key" ON "anomchat_sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_sessions_jti_key" ON "anomchat_sessions"("jti");

-- CreateIndex
CREATE INDEX "anomchat_sessions_user_id_idx" ON "anomchat_sessions"("user_id");

-- CreateIndex
CREATE INDEX "anomchat_sessions_jti_idx" ON "anomchat_sessions"("jti");

-- CreateIndex
CREATE INDEX "anomchat_sessions_expires_at_idx" ON "anomchat_sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_refresh_tokens_id_key" ON "anomchat_refresh_tokens"("id");

-- CreateIndex
CREATE INDEX "anomchat_refresh_tokens_user_id_idx" ON "anomchat_refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "anomchat_refresh_tokens_jti_idx" ON "anomchat_refresh_tokens"("jti");

-- CreateIndex
CREATE INDEX "anomchat_refresh_tokens_expires_at_idx" ON "anomchat_refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_refresh_tokens_user_id_jti_key" ON "anomchat_refresh_tokens"("user_id", "jti");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_blacklist_access_tokens_id_key" ON "anomchat_blacklist_access_tokens"("id");

-- CreateIndex
CREATE INDEX "anomchat_blacklist_access_tokens_user_id_idx" ON "anomchat_blacklist_access_tokens"("user_id");

-- CreateIndex
CREATE INDEX "anomchat_blacklist_access_tokens_jti_idx" ON "anomchat_blacklist_access_tokens"("jti");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_blacklist_access_tokens_user_id_jti_key" ON "anomchat_blacklist_access_tokens"("user_id", "jti");

-- AddForeignKey
ALTER TABLE "anomchat_users" ADD CONSTRAINT "anomchat_users_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "anomchat_document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomchat_sessions" ADD CONSTRAINT "anomchat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "anomchat_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomchat_refresh_tokens" ADD CONSTRAINT "anomchat_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "anomchat_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomchat_blacklist_access_tokens" ADD CONSTRAINT "anomchat_blacklist_access_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "anomchat_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "anomchat_conversations" (
    "id" UUID NOT NULL,
    "user_a_id" UUID NOT NULL,
    "user_b_id" UUID NOT NULL,
    "alias_a" VARCHAR(60) NOT NULL,
    "alias_b" VARCHAR(60) NOT NULL,
    "anonymous_a" BOOLEAN NOT NULL DEFAULT true,
    "anonymous_b" BOOLEAN NOT NULL DEFAULT true,
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomchat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomchat_messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anomchat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_conversations_id_key" ON "anomchat_conversations"("id");
CREATE INDEX "anomchat_conversations_user_a_id_idx" ON "anomchat_conversations"("user_a_id");
CREATE INDEX "anomchat_conversations_user_b_id_idx" ON "anomchat_conversations"("user_b_id");
CREATE INDEX "anomchat_conversations_last_message_at_idx" ON "anomchat_conversations"("last_message_at");
CREATE UNIQUE INDEX "anomchat_conversations_user_a_id_user_b_id_key" ON "anomchat_conversations"("user_a_id", "user_b_id");

-- CreateIndex
CREATE UNIQUE INDEX "anomchat_messages_id_key" ON "anomchat_messages"("id");
CREATE INDEX "anomchat_messages_conversation_id_idx" ON "anomchat_messages"("conversation_id");
CREATE INDEX "anomchat_messages_sender_id_idx" ON "anomchat_messages"("sender_id");
CREATE INDEX "anomchat_messages_created_at_idx" ON "anomchat_messages"("created_at");

-- AddForeignKey
ALTER TABLE "anomchat_conversations" ADD CONSTRAINT "anomchat_conversations_user_a_id_fkey" FOREIGN KEY ("user_a_id") REFERENCES "anomchat_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "anomchat_conversations" ADD CONSTRAINT "anomchat_conversations_user_b_id_fkey" FOREIGN KEY ("user_b_id") REFERENCES "anomchat_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "anomchat_messages" ADD CONSTRAINT "anomchat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "anomchat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "anomchat_messages" ADD CONSTRAINT "anomchat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "anomchat_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

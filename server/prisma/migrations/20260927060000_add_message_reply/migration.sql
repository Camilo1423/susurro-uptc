-- AlterTable: soporte de respuestas (mensaje que responde a otro)
ALTER TABLE "anomchat_messages" ADD COLUMN "reply_to_id" UUID;

-- CreateIndex
CREATE INDEX "anomchat_messages_reply_to_id_idx" ON "anomchat_messages"("reply_to_id");

-- AddForeignKey: auto-relación; si el mensaje citado se borra, la cita queda en NULL
ALTER TABLE "anomchat_messages" ADD CONSTRAINT "anomchat_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "anomchat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

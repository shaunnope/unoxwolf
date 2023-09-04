/*
  Warnings:

  - A unique constraint covering the columns `[user_id,chat_id,topic_id]` on the table `stats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "stats_chat_id_topic_id_key";

-- DropIndex
DROP INDEX "stats_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "stats_user_id_chat_id_topic_id_key" ON "stats"("user_id", "chat_id", "topic_id");

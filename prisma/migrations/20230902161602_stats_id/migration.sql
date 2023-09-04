/*
  Warnings:

  - A unique constraint covering the columns `[chat_id,topic_id]` on the table `stats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `topic_id` to the `stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stats" ADD COLUMN     "topic_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "stats_chat_id_topic_id_key" ON "stats"("chat_id", "topic_id");

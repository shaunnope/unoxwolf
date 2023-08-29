-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "language_code" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "chat_id" BIGINT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "villager_win" INTEGER NOT NULL DEFAULT 0,
    "villager_lose" INTEGER NOT NULL DEFAULT 0,
    "werewolf_win" INTEGER NOT NULL DEFAULT 0,
    "werewolf_lose" INTEGER NOT NULL DEFAULT 0,
    "tanner_win" INTEGER NOT NULL DEFAULT 0,
    "tanner_lose" INTEGER NOT NULL DEFAULT 0,
    "vampire_win" INTEGER NOT NULL DEFAULT 0,
    "vampire_lose" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "stats_user_id_key" ON "stats"("user_id");

-- AddForeignKey
ALTER TABLE "stats" ADD CONSTRAINT "stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("telegram_id") ON DELETE RESTRICT ON UPDATE CASCADE;

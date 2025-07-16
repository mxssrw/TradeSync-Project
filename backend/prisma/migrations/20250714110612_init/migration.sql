/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `trades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trades" DROP CONSTRAINT "trades_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password";

-- DropTable
DROP TABLE "trades";

-- DropEnum
DROP TYPE "TradeSide";

-- DropEnum
DROP TYPE "TradeStatus";

-- DropEnum
DROP TYPE "TradeType";

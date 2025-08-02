-- CreateEnum
CREATE TYPE "PayMethod" AS ENUM ('CASH', 'ONLINE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payment" "PayMethod" NOT NULL DEFAULT 'CASH';

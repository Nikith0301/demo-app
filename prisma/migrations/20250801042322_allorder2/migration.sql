/*
  Warnings:

  - You are about to drop the `ServiceInOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceInOrder" DROP CONSTRAINT "ServiceInOrder_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "service" TEXT,
ADD COLUMN     "subservice" TEXT;

-- DropTable
DROP TABLE "ServiceInOrder";

/*
  Warnings:

  - You are about to drop the column `status` on the `ServiceInOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus";

-- AlterTable
ALTER TABLE "ServiceInOrder" DROP COLUMN "status";

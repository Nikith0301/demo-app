/*
  Warnings:

  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - Added the required column `date` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ServiceInOrder" ADD COLUMN     "status" "OrderStatus";

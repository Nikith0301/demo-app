/*
  Warnings:

  - You are about to drop the column `amount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sub_service` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "amount",
DROP COLUMN "service",
DROP COLUMN "sub_service",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "ServiceInOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION,

    CONSTRAINT "ServiceInOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubServiceInOrder" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SubServiceInOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceInOrder" ADD CONSTRAINT "ServiceInOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubServiceInOrder" ADD CONSTRAINT "SubServiceInOrder_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceInOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `SubServiceInOrder` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `ServiceInOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceId]` on the table `SubServiceInOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `leadId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - The required column `orderId` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `profit` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `SubServiceInOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "ServiceInOrder" DROP CONSTRAINT "ServiceInOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "SubServiceInOrder" DROP CONSTRAINT "SubServiceInOrder_serviceId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "address",
DROP COLUMN "customer_id",
DROP COLUMN "order_id",
DROP COLUMN "totalAmount",
ADD COLUMN     "leadId" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "profit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vendor" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId");

-- AlterTable
ALTER TABLE "SubServiceInOrder" DROP COLUMN "amount",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "lead_status" "LeadStatus",
    "source" "SourcePlatform",
    "comments" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_phone_key" ON "Lead"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceInOrder_orderId_key" ON "ServiceInOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "SubServiceInOrder_serviceId_key" ON "SubServiceInOrder"("serviceId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceInOrder" ADD CONSTRAINT "ServiceInOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubServiceInOrder" ADD CONSTRAINT "SubServiceInOrder_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceInOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

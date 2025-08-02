/*
  Warnings:

  - You are about to drop the column `name` on the `ServiceInOrder` table. All the data in the column will be lost.
  - You are about to drop the `SubServiceInOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `service` to the `ServiceInOrder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Services" AS ENUM ('CLEANING', 'ELECTRIC', 'CAR_WASH', 'PLUMBING', 'NA');

-- DropForeignKey
ALTER TABLE "SubServiceInOrder" DROP CONSTRAINT "SubServiceInOrder_serviceId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "profit" SET DEFAULT 0,
ALTER COLUMN "revenue" SET DEFAULT 0,
ALTER COLUMN "vendor" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ServiceInOrder" DROP COLUMN "name",
ADD COLUMN     "service" TEXT NOT NULL,
ADD COLUMN     "subservice" TEXT;

-- DropTable
DROP TABLE "SubServiceInOrder";

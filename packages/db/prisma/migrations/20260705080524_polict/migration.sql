-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "policy" ADD COLUMN     "error" TEXT,
ADD COLUMN     "status" "PolicyStatus" NOT NULL DEFAULT 'PENDING';

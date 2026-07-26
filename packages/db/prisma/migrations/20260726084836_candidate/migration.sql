/*
  Warnings:

  - A unique constraint covering the columns `[email,policyId]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Candidate_email_key";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "policyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_policyId_key" ON "Candidate"("email", "policyId");

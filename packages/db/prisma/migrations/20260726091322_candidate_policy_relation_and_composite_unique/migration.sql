/*
  Warnings:

  - Made the column `policyId` on table `Candidate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "policyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

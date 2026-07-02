-- CreateTable
CREATE TABLE "policy" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "policy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "policy_key_key" ON "policy"("key");

-- CreateIndex
CREATE INDEX "policy_userId_idx" ON "policy"("userId");

-- AddForeignKey
ALTER TABLE "policy" ADD CONSTRAINT "policy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

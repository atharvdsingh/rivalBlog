/*
  Warnings:

  - A unique constraint covering the columns `[userId,blogId]` on the table `like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_blogId_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_blogId_fkey";

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "comment_blogId_idx" ON "comment"("blogId");

-- CreateIndex
CREATE INDEX "comment_createdAt_idx" ON "comment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "like_userId_blogId_key" ON "like"("userId", "blogId");

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

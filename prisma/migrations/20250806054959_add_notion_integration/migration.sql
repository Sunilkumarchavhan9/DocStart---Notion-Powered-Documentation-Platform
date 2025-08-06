-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "notionPageId" TEXT,
ADD COLUMN     "notionPageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notionAccessToken" TEXT,
ADD COLUMN     "notionBotId" TEXT,
ADD COLUMN     "notionWorkspaceId" TEXT;

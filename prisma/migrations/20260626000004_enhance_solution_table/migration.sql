-- AlterTable
ALTER TABLE solutions ADD COLUMN thumbnailUrl VARCHAR(191) NULL;
ALTER TABLE solutions ADD COLUMN tags JSON NULL;
ALTER TABLE solutions ADD COLUMN authorId VARCHAR(191) NULL;
ALTER TABLE solutions ADD COLUMN orgId VARCHAR(191) NULL;
ALTER TABLE solutions ADD COLUMN rejectionReason TEXT NULL;
ALTER TABLE solutions ADD COLUMN viewCount INTEGER NOT NULL DEFAULT 0;

-- Note: solutions.status is stored as VARCHAR(191) with no native enum/CHECK
-- constraint, so extending SolutionStatus with PENDING_REVIEW/REJECTED is a
-- Prisma-schema-level change only and requires no column alteration here.

-- AddForeignKey
ALTER TABLE solutions ADD CONSTRAINT solutions_authorId_fkey FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL ;
ALTER TABLE solutions ADD CONSTRAINT solutions_orgId_fkey FOREIGN KEY (orgId) REFERENCES organizations(id) ON DELETE SET NULL ;

-- CreateIndex
CREATE INDEX solutions_authorId_idx ON solutions(authorId);
CREATE INDEX solutions_orgId_idx ON solutions(orgId);

-- AlterTable
ALTER TABLE lessons ADD COLUMN audioUrl VARCHAR(191) NULL;
ALTER TABLE lessons ADD COLUMN attachments JSON NULL;

-- Note: lessons.type is stored as VARCHAR(191) (no native enum/CHECK constraint in
-- Postgres for this project), so adding AUDIO to the LessonType enum is a
-- Prisma-schema-level change only and requires no column alteration here.

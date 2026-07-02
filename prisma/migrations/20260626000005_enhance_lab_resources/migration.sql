-- AlterTable
ALTER TABLE lab_resources ADD COLUMN content TEXT NULL;
ALTER TABLE lab_resources ADD COLUMN pdfUrls JSON NULL;
ALTER TABLE lab_resources ADD COLUMN imageUrls JSON NULL;

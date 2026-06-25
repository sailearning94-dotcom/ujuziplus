/*
  Warnings:

  - Added the required column slug to the lessons table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE lessons ADD COLUMN slug VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE enrollments (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    courseId VARCHAR(191) NOT NULL,
    enrolledAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    completedAt TIMESTAMP(3) NULL,

    UNIQUE INDEX enrollments_userId_courseId_key(userId, courseId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE lesson_progress (
    id VARCHAR(191) NOT NULL,
    enrollmentId VARCHAR(191) NOT NULL,
    lessonId VARCHAR(191) NOT NULL,
    completedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX lesson_progress_enrollmentId_lessonId_key(enrollmentId, lessonId),
    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE enrollments ADD CONSTRAINT enrollments_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE enrollments ADD CONSTRAINT enrollments_courseId_fkey FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE lesson_progress ADD CONSTRAINT lesson_progress_enrollmentId_fkey FOREIGN KEY (enrollmentId) REFERENCES enrollments(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE lesson_progress ADD CONSTRAINT lesson_progress_lessonId_fkey FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE ;

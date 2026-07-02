-- CreateTable
CREATE TABLE quizzes (
    id VARCHAR(191) NOT NULL,
    lessonId VARCHAR(191) NOT NULL,
    passMark INTEGER NOT NULL DEFAULT 70,
    timeLimit INTEGER NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT quizzes_lessonId_key UNIQUE (lessonId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE quiz_questions (
    id VARCHAR(191) NOT NULL,
    quizId VARCHAR(191) NOT NULL,
    text TEXT NOT NULL,
    explanation TEXT NULL,
    orderIndex INTEGER NOT NULL DEFAULT 0,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE quiz_options (
    id VARCHAR(191) NOT NULL,
    questionId VARCHAR(191) NOT NULL,
    text VARCHAR(191) NOT NULL,
    isCorrect BOOLEAN NOT NULL DEFAULT false,
    orderIndex INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE quiz_attempts (
    id VARCHAR(191) NOT NULL,
    quizId VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    startedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    completedAt TIMESTAMP(3) NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE quiz_attempt_answers (
    id VARCHAR(191) NOT NULL,
    attemptId VARCHAR(191) NOT NULL,
    questionId VARCHAR(191) NOT NULL,
    optionId VARCHAR(191) NULL,
    isCorrect BOOLEAN NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE certificates (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    courseId VARCHAR(191) NOT NULL,
    issuedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    verifyCode VARCHAR(191) NOT NULL,

    CONSTRAINT certificates_verifyCode_key UNIQUE (verifyCode),
    CONSTRAINT certificates_userId_courseId_key UNIQUE (userId, courseId),
    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE quizzes ADD CONSTRAINT quizzes_lessonId_fkey FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE quiz_questions ADD CONSTRAINT quiz_questions_quizId_fkey FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE quiz_options ADD CONSTRAINT quiz_options_questionId_fkey FOREIGN KEY (questionId) REFERENCES quiz_questions(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE quiz_attempts ADD CONSTRAINT quiz_attempts_quizId_fkey FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE RESTRICT ;

-- AddForeignKey
ALTER TABLE quiz_attempts ADD CONSTRAINT quiz_attempts_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT ;

-- AddForeignKey
ALTER TABLE quiz_attempt_answers ADD CONSTRAINT quiz_attempt_answers_attemptId_fkey FOREIGN KEY (attemptId) REFERENCES quiz_attempts(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE quiz_attempt_answers ADD CONSTRAINT quiz_attempt_answers_questionId_fkey FOREIGN KEY (questionId) REFERENCES quiz_questions(id) ON DELETE RESTRICT ;

-- AddForeignKey
ALTER TABLE certificates ADD CONSTRAINT certificates_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT ;

-- AddForeignKey
ALTER TABLE certificates ADD CONSTRAINT certificates_courseId_fkey FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE RESTRICT ;

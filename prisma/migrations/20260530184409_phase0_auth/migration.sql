-- CreateTable
CREATE TABLE users (
    id VARCHAR(191) NOT NULL,
    fullName VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    username VARCHAR(100) NOT NULL,
    passwordHash VARCHAR(191) NOT NULL,
    role VARCHAR(191) NOT NULL DEFAULT 'STUDENT',
    avatarUrl VARCHAR(191) NULL,
    bio TEXT NULL,
    location VARCHAR(191) NULL,
    website VARCHAR(191) NULL,
    linkedin VARCHAR(191) NULL,
    github VARCHAR(191) NULL,
    isActive BOOLEAN NOT NULL DEFAULT true,
    emailVerified BOOLEAN NOT NULL DEFAULT false,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE password_reset_tokens (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    token VARCHAR(191) NOT NULL,
    expiresAt TIMESTAMP(3) NOT NULL,
    usedAt TIMESTAMP(3) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT password_reset_tokens_token_key UNIQUE (token),
    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE password_reset_tokens ADD CONSTRAINT password_reset_tokens_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

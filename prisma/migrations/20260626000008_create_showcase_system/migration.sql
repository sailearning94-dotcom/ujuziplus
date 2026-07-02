-- CreateTable
CREATE TABLE showcase_projects (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(280) NULL,
    description TEXT NOT NULL,
    thumbnailUrl VARCHAR(191) NULL,
    demoUrl VARCHAR(191) NULL,
    repoUrl VARCHAR(191) NULL,
    videoUrl VARCHAR(191) NULL,
    techStack JSON NOT NULL,
    track VARCHAR(100) NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    isFeatured BOOLEAN NOT NULL DEFAULT false,
    viewCount INTEGER NOT NULL DEFAULT 0,
    likeCount INTEGER NOT NULL DEFAULT 0,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE showcase_likes (
    id VARCHAR(191) NOT NULL,
    projectId VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT showcase_likes_projectId_userId_key UNIQUE (projectId, userId),
    PRIMARY KEY (id)
) ;

-- CreateIndex
CREATE INDEX showcase_projects_userId_idx ON showcase_projects(userId);
CREATE INDEX showcase_projects_status_idx ON showcase_projects(status);
CREATE INDEX showcase_likes_userId_idx ON showcase_likes(userId);

-- AddForeignKey
ALTER TABLE showcase_projects ADD CONSTRAINT showcase_projects_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;
ALTER TABLE showcase_likes ADD CONSTRAINT showcase_likes_projectId_fkey FOREIGN KEY (projectId) REFERENCES showcase_projects(id) ON DELETE CASCADE ;
ALTER TABLE showcase_likes ADD CONSTRAINT showcase_likes_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;
